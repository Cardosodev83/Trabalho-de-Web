const express = require('express');
const router = express.Router();
const voluntarioController = require('../controllers/voluntarioController');

router.get('/', voluntarioController.listarVoluntarios);
router.get('/stats', voluntarioController.obterEstatisticas);
router.get('/:id', voluntarioController.buscarVoluntarioPorId);
router.post('/', voluntarioController.criarVoluntario);
router.put('/:id', voluntarioController.atualizarVoluntario);
router.delete('/:id', voluntarioController.deletarVoluntario);

module.exports = router;
