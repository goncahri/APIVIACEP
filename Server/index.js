require('dotenv').config();

const express = require('express');
const cors = require('cors');

const conectarMongo = require('./config/db');
const entregaRoutes = require('./routes/entrega.routes');

const app = express();

app.use(cors());
app.use(express.json());


// conectar Mongo
conectarMongo();


// rota teste
app.get('/', (req, res) => {
  res.send('API Entrego rodando');
});


// rotas da aplicação
app.use('/', entregaRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});