const express = require('express');
const router = express.Router();
const galeriaController = require('../controllers/galeriaController');

// GET /api/galeria - Listar todas
router.get('/', galeriaController.listarImagens);

// GET /api/galeria/stats - Estatísticas
router.get('/stats', galeriaController.obterEstatisticas);

// GET /api/galeria/:id - Buscar por ID
router.get('/:id', galeriaController.buscarImagemPorId);

// POST /api/galeria - Criar nova
router.post('/', galeriaController.criarImagem);

// PUT /api/galeria/:id - Atualizar
router.put('/:id', galeriaController.atualizarImagem);

// DELETE /api/galeria/:id - Deletar
router.delete('/:id', galeriaController.deletarImagem);

module.exports = router;
