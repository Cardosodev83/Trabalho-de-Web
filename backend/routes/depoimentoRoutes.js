const express = require('express');
const router = express.Router();
const depoimentoController = require('../controllers/depoimentoController');

// GET /api/depoimentos - Listar todos
router.get('/', depoimentoController.listarDepoimentos);

// GET /api/depoimentos/stats - Estatísticas
router.get('/stats', depoimentoController.obterEstatisticas);

// GET /api/depoimentos/:id - Buscar por ID
router.get('/:id', depoimentoController.buscarDepoimentoPorId);

// POST /api/depoimentos - Criar novo
router.post('/', depoimentoController.criarDepoimento);

// PUT /api/depoimentos/:id - Atualizar
router.put('/:id', depoimentoController.atualizarDepoimento);

// DELETE /api/depoimentos/:id - Deletar
router.delete('/:id', depoimentoController.deletarDepoimento);

module.exports = router;
