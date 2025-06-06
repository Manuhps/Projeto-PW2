const express = require('express');
const router = express.Router();
const inscricoesController = require('../controllers/inscricoesController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas públicas
router.get('/', inscricoesController.getAllInscricoes);
router.get('/:id', inscricoesController.getInscricaoById);

// Rotas protegidas
router.post('/', authMiddleware.verifyToken, inscricoesController.createInscricao);
router.put('/:id', authMiddleware.verifyToken, inscricoesController.updateInscricao);
router.delete('/:id', authMiddleware.verifyToken, inscricoesController.deleteInscricao);

module.exports = router; 