const express = require('express');
const router = express.Router();
const reservasController = require('../controllers/reservasController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas públicas
router.get('/', reservasController.getAllReservas);
router.get('/:id', reservasController.getReservaById);

// Rotas protegidas
router.post('/', authMiddleware.verifyToken, reservasController.createReserva);
router.put('/:id', authMiddleware.verifyToken, reservasController.updateReserva);
router.delete('/:id', authMiddleware.verifyToken, reservasController.deleteReserva);

module.exports = router; 