const express = require('express');
const router = express.Router();
const doacaoController = require('../controllers/doacaoController');

// Rotas de Doações
router.get('/', doacaoController.listarTodas);
router.post('/', doacaoController.criar);
router.get('/relatorio', doacaoController.relatorio);

module.exports = router;
