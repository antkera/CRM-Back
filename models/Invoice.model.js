const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: Number,
    required: true
  },
  prefix: {
    type: String,
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  concepts: [{
    concept: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    child: { type: String }
  }],
  total: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Asegurarse de que la combinación de prefijo y número de factura sea única para cada usuario
InvoiceSchema.index({ user: 1, prefix: 1, invoiceNumber: 1 }, { unique: true });

const Invoice = mongoose.model('Invoice', InvoiceSchema);

module.exports = Invoice;
