// Client.js
const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  apellidos: {
    type: String,
    required: true
  },
  dni: {
    type: String,
    required: true,
    match: [
      /^([0-9]{8}[A-Z])|([A-Z][0-9]{7}[0-9A-Z])$/, 
      'El campo debe ser un DNI válido (8 dígitos + letra) o un CIF válido (letra + 7 dígitos + dígito/letra)'
    ]
  },
  direccion: {
    type: String,
    required: true
  },
  telefono: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  hijos: {
    type: [String],
    required: true
  }
});

const Client = mongoose.model('Client', ClientSchema);

module.exports = Client;
