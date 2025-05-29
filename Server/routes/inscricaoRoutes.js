const express = require('express');
const router = express.Router();
const inscricaoController = require('../controllers/inscricaoController');
const { auth, isOrganizador } = require('../middleware/auth');

// Rotas protegidas para usuários
router.get('/minhas-inscricoes', auth, inscricaoController.getMinhasInscricoes);
router.get('/:id', auth, inscricaoController.getInscricaoById);
router.patch('/:id/cancelar', auth, inscricaoController.cancelarInscricao);

// Rotas protegidas para organizadores
router.get('/evento/:eventoId', auth, isOrganizador, inscricaoController.getInscricoesEvento);
router.patch('/:id/status', auth, isOrganizador, inscricaoController.atualizarStatusInscricao);
router.patch('/:id/pagamento', auth, isOrganizador, inscricaoController.atualizarStatusPagamento);

module.exports = router; 