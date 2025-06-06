const express = require('express');
const router = express.Router();
const eventosController = require('../controllers/eventosController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas públicas
router.get('/', eventosController.getAllEventos);
router.get('/:id', eventosController.getEventoById);

// Rotas protegidas
router.post('/', authMiddleware.verifyToken, authMiddleware.isOrganizador, eventosController.createEvento);
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isOrganizador, eventosController.updateEvento);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isOrganizador, eventosController.deleteEvento);

// Rotas para gerenciar inscrições
router.post('/:id/inscrever', authMiddleware.verifyToken, authMiddleware.isEstudante, eventosController.inscreverEmEvento);
router.get('/:id/inscritos', authMiddleware.verifyToken, authMiddleware.isOrganizador, eventosController.getInscritos);
router.patch('/:id/inscricao/:inscricaoId', authMiddleware.verifyToken, authMiddleware.isOrganizador, eventosController.atualizarStatusInscricao);

module.exports = router; 