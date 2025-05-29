const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');
const { auth, isOrganizador } = require('../middleware/auth');

// Rotas públicas
router.get('/', eventoController.getAllEventos);
router.get('/:id', eventoController.getEventoById);

// Rotas protegidas
router.post('/', auth, isOrganizador, eventoController.createEvento);
router.patch('/:id', auth, isOrganizador, eventoController.updateEvento);
router.delete('/:id', auth, isOrganizador, eventoController.deleteEvento);

// Rotas para gerenciar inscrições
router.post('/:id/inscricao', auth, eventoController.inscreverEvento);
router.get('/:id/inscritos', auth, isOrganizador, eventoController.getInscritos);
router.patch('/:id/inscricao/:inscricaoId', auth, isOrganizador, eventoController.atualizarStatusInscricao);

module.exports = router; 