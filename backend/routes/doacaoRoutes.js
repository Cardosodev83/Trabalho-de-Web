const express = require('express');
const router = express.Router();
const doacaoController = require('../controllers/doacaoController');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ROTAS DE DOAÇÕES - CRUD COMPLETO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// GET /api/doacoes - Listar todas as doações
router.get('/', doacaoController.listarTodas);

// GET /api/doacoes/relatorio - Relatório de doações (antes do :id)
router.get('/relatorio', doacaoController.relatorio);

// GET /api/doacoes/:id - Buscar doação por ID
router.get('/:id', doacaoController.buscarPorId);

// POST /api/doacoes - Criar nova doação
router.post('/', doacaoController.criar);

// PUT /api/doacoes/:id - Atualizar doação
router.put('/:id', doacaoController.atualizar);

// DELETE /api/doacoes/:id - Deletar doação
router.delete('/:id', doacaoController.deletar);

module.exports = router;
