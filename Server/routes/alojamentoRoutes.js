const express = require('express');
const router = express.Router();
const alojamentosController = require('../controllers/alojamentosController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas públicas
router.get('/', alojamentosController.getAllAlojamentos);
router.get('/:id', alojamentosController.getAlojamentoById);

// Rotas protegidas
router.post('/', authMiddleware.verifyToken, authMiddleware.isProprietario, alojamentosController.createAlojamento);
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isOwnerOrAdmin, alojamentosController.updateAlojamento);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isOwnerOrAdmin, alojamentosController.deleteAlojamento);

module.exports = router; 