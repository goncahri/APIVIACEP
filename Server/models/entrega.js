const mongoose = require('mongoose');

const EntregaSchema = new mongoose.Schema(
  {
    cliente: {
      type: String,
      required: true,
    },

    produto: {
      type: String,
      required: true,
    },

    cep: String,
    logradouro: String,
    numero: String,
    complemento: String,
    bairro: String,
    cidade: String,
    estado: String,

    status: {
      type: String,
      default: 'Pendente',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Entrega', EntregaSchema);