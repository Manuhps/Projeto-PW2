const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const alojamentoRoutes = require('./alojamentoRoutes');
const eventoRoutes = require('./eventoRoutes');
const reservaRoutes = require('./reservaRoutes');
const inscricaoRoutes = require('./inscricaoRoutes');

// Rotas da API
router.use('/api/users', userRoutes);
router.use('/api/alojamentos', alojamentoRoutes);
router.use('/api/eventos', eventoRoutes);
router.use('/api/reservas', reservaRoutes);
router.use('/api/inscricoes', inscricaoRoutes);

module.exports = router; 