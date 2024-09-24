const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  invoiceNumber: {
    type: Number,
    required: true,
  },
  prefix: {
    type: String,
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  concepts: [
    {
      concept: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      child: { type: String },
      ivaPercentage: {
        type: Number,
        required: true,
        default: 21, // Porcentaje predeterminado del IVA
      },
      retentionPercentage: {
        type: Number,
        required: true,
        default: 0, // Porcentaje predeterminado de retención
      },
    },
  ],

  subtotal: {
    type: Number,
    
  },

  ivaAmount: {
    type: Number,
    required: true,
    default: 0,
  },

  retentionAmount: {
    type: Number,
    required: true,
    default: 0,
  },

  total: {
    type: Number,
    
  },
});

// Asegurarse de que la combinación de prefijo y número de factura sea única para cada usuario
InvoiceSchema.index({ user: 1, prefix: 1, invoiceNumber: 1 }, { unique: true });

// Middleware para calcular IVA, retención, subtotal y total antes de guardar
InvoiceSchema.pre("save", function (next) {
  const invoice = this;

  // Inicializamos los valores en 0
  let subtotal = 0;
  let ivaAmount = 0;
  let retentionAmount = 0;

  // Iterar sobre cada concepto para calcular los montos
  invoice.concepts.forEach((concept) => {
    const conceptSubtotal = concept.price * concept.quantity;

    // Acumular el subtotal
    subtotal += conceptSubtotal;

    // Calcular y acumular el IVA y la retención por concepto
    ivaAmount += (conceptSubtotal * concept.ivaPercentage) / 100;
    retentionAmount += (conceptSubtotal * concept.retentionPercentage) / 100;
  });

  // Asignamos los valores calculados
  invoice.subtotal = subtotal;
  invoice.ivaAmount = ivaAmount;
  invoice.retentionAmount = retentionAmount;

  // El total se calcula sumando el subtotal y el IVA, menos la retención
  invoice.total = subtotal + ivaAmount - retentionAmount;

  next();
});

const Invoice = mongoose.model("Invoice", InvoiceSchema);

module.exports = Invoice;
