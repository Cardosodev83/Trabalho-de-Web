const express = require('express');
const router = express.Router();
const projetoController = require('../controllers/projetoController');

// Rotas de Projetos
router.get('/', projetoController.listarTodos);
router.get('/:id', projetoController.buscarPorId);
router.post('/', projetoController.criar);
router.put('/:id', projetoController.atualizar);
router.delete('/:id', projetoController.deletar);

module.exports = router;
