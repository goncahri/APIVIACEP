const Entrega = require('../models/Entrega');


// LISTAR
const listar = async (req, res) => {
  try {
    const entregas = await Entrega.find();

    res.status(200).json(entregas);

  } catch (error) {
    res.status(500).json({
      erro: 'Erro ao listar entregas',
      detalhes: error.message
    });
  }
};


// CADASTRAR
const cadastrar = async (req, res) => {
  try {
    const novaEntrega = await Entrega.create(req.body);

    res.status(201).json(novaEntrega);

  } catch (error) {
    res.status(500).json({
      erro: 'Erro ao cadastrar entrega',
      detalhes: error.message
    });
  }
};


// EDITAR
const atualizar = async (req, res) => {
  try {

    const entrega = await Entrega.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(entrega);

  } catch (error) {
    res.status(500).json({
      erro: 'Erro ao atualizar entrega',
      detalhes: error.message
    });
  }
};


// EXCLUIR
const excluir = async (req, res) => {
  try {

    await Entrega.findByIdAndDelete(req.params.id);

    res.status(200).json({
      mensagem: 'Entrega excluída com sucesso'
    });

  } catch (error) {
    res.status(500).json({
      erro: 'Erro ao excluir entrega',
      detalhes: error.message
    });
  }
};


module.exports = {
  listar,
  cadastrar,
  atualizar,
  excluir
};