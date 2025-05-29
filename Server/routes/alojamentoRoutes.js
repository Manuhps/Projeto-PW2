const express = require('express');
const router = express.Router();
const alojamentoController = require('../controllers/alojamentoController');
const { auth, isProprietario } = require('../middleware/auth');

// Rotas públicas
router.get('/', alojamentoController.getAllAlojamentos);
router.get('/:id', alojamentoController.getAlojamentoById);

// Rotas protegidas
router.post('/', auth, isProprietario, alojamentoController.createAlojamento);
router.patch('/:id', auth, isProprietario, alojamentoController.updateAlojamento);
router.delete('/:id', auth, isProprietario, alojamentoController.deleteAlojamento);

// Rotas para gerenciar disponibilidade
router.patch('/:id/disponibilidade', auth, isProprietario, alojamentoController.updateDisponibilidade);

module.exports = router; 