const express = require('express');
const router = express.Router();
const Invoice = require('../../models/Invoice.model');
const User = require('../../models/User.model');
const isTokenValid = require('../../middlewares/auth.middlewares');




// POST "/api/invoices" => Crear una nueva factura y asignarla al usuario
router.post('/', isTokenValid, async (req, res, next) => {
  const { prefix, invoiceNumber, client, concepts,invoiceDate } = req.body;
  const userId = req.payload._id;

  try {
    
    // Calcular el total de la factura
    const total = concepts.reduce((acc, concept) => acc + concept.quantity * concept.price, 0);

    // Crear la nueva factura
    const newInvoice = new Invoice({
      invoiceNumber,
      prefix,
      invoiceDate,
      client,
      concepts,
      total,
      user: userId // Asignar la factura al usuario que la crea
    });

    const savedInvoice = await newInvoice.save();

    res.status(201).json({ message: 'Factura creada', invoice: savedInvoice });
  } catch (error) {
    next(error);
  }
});

// GET "/api/invoices/nextInvoiceNumber" => Obtener el próximo número de factura para un prefijo específico
router.get('/nextInvoiceNumber', isTokenValid, async (req, res, next) => {
  const { prefix } = req.query;
  const userId = req.payload._id;

  try {
    const lastInvoice = await Invoice.findOne({ user: userId, prefix }).sort({ invoiceNumber: -1 });
    const nextInvoiceNumber = lastInvoice ? lastInvoice.invoiceNumber + 1 : 1;

    res.status(200).json({ nextInvoiceNumber });
  } catch (error) {
    next(error);
  }
});


// GET "/api/invoices" => Obtener todas las facturas del usuario actual
router.get('/', isTokenValid, async (req, res, next) => {
  const userId = req.payload._id;

  try {
    const invoices = await Invoice.find({ user: userId }).populate('client');
    res.status(200).json(invoices);
  } catch (error) {
    next(error);
  }
});

// GET "/api/invoices/:id" => Obtener los detalles de una factura específica
router.get('/:id', isTokenValid, async (req, res, next) => {
  const { id } = req.params;
  const userId = req.payload._id;

  try {
    const invoice = await Invoice.findOne({ _id: id, user: userId }).populate('client');
    if (!invoice) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }
    res.status(200).json(invoice);
  } catch (error) {
    next(error);
  }
});

// PUT "/api/invoices/:id" => Actualizar una factura específica
router.put('/:id', isTokenValid, async (req, res, next) => {
  const { id } = req.params;
  const { invoiceNumber, client, concepts, invoiceDate } = req.body;
  const userId = req.payload._id;

  try {
    const total = concepts.reduce((acc, concept) => acc + concept.quantity * concept.price, 0);

    const updatedInvoice = await Invoice.findOneAndUpdate(
      { _id: id, user: userId },
      { invoiceNumber, client, concepts, invoiceDate, total },
      { new: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: 'Factura no encontrada o no tienes permiso para actualizarla' });
    }

    res.status(200).json({ message: 'Factura actualizada', invoice: updatedInvoice });
  } catch (error) {
    next(error);
  }
});

// DELETE "/api/invoices/:id" => Eliminar una factura específica
router.delete('/:id', isTokenValid, async (req, res, next) => {
  const { id } = req.params;
  const userId = req.payload._id;

  try {
    const deletedInvoice = await Invoice.findOneAndDelete({ _id: id, user: userId });

    if (!deletedInvoice) {
      return res.status(404).json({ message: 'Factura no encontrada o no tienes permiso para eliminarla' });
    }

    // Eliminar la referencia de la factura en el usuario
    await User.findByIdAndUpdate(userId, { $pull: { bills: id } });

    res.status(200).json({ message: 'Factura eliminada' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
