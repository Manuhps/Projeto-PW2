const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const alojamentoRoutes = require('./alojamentoRoutes');
const eventoRoutes = require('./eventoRoutes');
const reservaRoutes = require('./reservaRoutes');
const inscricaoRoutes = require('./inscricaoRoutes');

// Rotas da API
router.use('/users', userRoutes);
router.use('/alojamentos', alojamentoRoutes);
router.use('/eventos', eventoRoutes);
router.use('/reservas', reservaRoutes);
router.use('/inscricoes', inscricaoRoutes);

module.exports = router; 