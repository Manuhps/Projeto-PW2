const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const { auth, isProprietario } = require('../middleware/auth');

// Rotas protegidas para usuários
router.get('/minhas-reservas', auth, reservaController.getMinhasReservas);
router.post('/', auth, reservaController.createReserva);
router.get('/:id', auth, reservaController.getReservaById);
router.patch('/:id/cancelar', auth, reservaController.cancelarReserva);

// Rotas protegidas para proprietários
router.get('/alojamento/:alojamentoId', auth, isProprietario, reservaController.getReservasAlojamento);
router.patch('/:id/status', auth, isProprietario, reservaController.atualizarStatusReserva);
router.patch('/:id/pagamento', auth, isProprietario, reservaController.atualizarStatusPagamento);

module.exports = router; 