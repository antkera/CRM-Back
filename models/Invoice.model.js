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
  
  ivaPercentage: {
    type: Number,
    required: true,
    default: 21 // Porcentaje predeterminado del IVA, puedes cambiarlo según sea necesario
  },
  
  ivaAmount: {
    type: Number,
    required: true,
    default: 0 // Inicialmente 0, se puede calcular antes de guardar
  },
  
  retentionPercentage: {
    type: Number,
    required: true,
    default: 0 // Porcentaje predeterminado de retención, ajustable
  },
  
  retentionAmount: {
    type: Number,
    required: true,
    default: 0 // Inicialmente 0, se puede calcular antes de guardar
  },
  
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

// Middleware para calcular IVA, retención y total antes de guardar
InvoiceSchema.pre('save', function(next) {
  const invoice = this;

  // Calcular IVA
  invoice.ivaAmount = (invoice.total * invoice.ivaPercentage) / 100;
  
  // Calcular retención
  invoice.retentionAmount = (invoice.total * invoice.retentionPercentage) / 100;
  
  // Calcular total con impuestos y retención
  invoice.total = invoice.total + invoice.ivaAmount - invoice.retentionAmount;
  
  next();
});

const Invoice = mongoose.model('Invoice', InvoiceSchema);

module.exports = Invoice;
