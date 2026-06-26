const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');

// GET /api/eventos - Listar todos
router.get('/', eventoController.listarEventos);

// GET /api/eventos/stats - Estatísticas
router.get('/stats', eventoController.obterEstatisticas);

// GET /api/eventos/:id - Buscar por ID
router.get('/:id', eventoController.buscarEventoPorId);

// POST /api/eventos - Criar novo
router.post('/', eventoController.criarEvento);

// PUT /api/eventos/:id - Atualizar
router.put('/:id', eventoController.atualizarEvento);

// DELETE /api/eventos/:id - Deletar
router.delete('/:id', eventoController.deletarEvento);

module.exports = router;
