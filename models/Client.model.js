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
    match: /^[0-9]{8}[A-Z]$/
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
