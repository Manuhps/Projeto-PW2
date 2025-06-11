const express = require('express');
const router = express.Router();
const avaliacoesController = require('../controllers/avaliacoesController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas públicas
router.get('/', avaliacoesController.getAllAvaliacoes);
router.get('/:id', avaliacoesController.getAvaliacaoById);
router.get('/alojamento/:alojamento_id', avaliacoesController.getAvaliacoesAlojamento);
router.get('/evento/:evento_id', avaliacoesController.getAvaliacoesEvento);

// Rotas protegidas
router.post('/', authMiddleware.verifyToken, avaliacoesController.createAvaliacao);
router.put('/:id', authMiddleware.verifyToken, avaliacoesController.updateAvaliacao);
router.delete('/:id', authMiddleware.verifyToken, avaliacoesController.deleteAvaliacao);

module.exports = router; 