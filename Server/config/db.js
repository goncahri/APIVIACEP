const mongoose = require('mongoose');

async function conectarMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB conectado com sucesso');
  } catch (error) {
    console.log('Erro ao conectar no Mongo:', error);
  }
}

module.exports = conectarMongo;