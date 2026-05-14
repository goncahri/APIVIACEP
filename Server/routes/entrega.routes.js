const express = require('express');

const router = express.Router();

const {
  listar,
  cadastrar,
  atualizar,
  excluir
} = require('../controllers/entrega.controller');


// GET
router.get('/entregas', listar);


// POST
router.post('/entregas', cadastrar);


// PUT
router.put('/entregas/:id', atualizar);


// DELETE
router.delete('/entregas/:id', excluir);


module.exports = router;