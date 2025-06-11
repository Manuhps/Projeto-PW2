const express = require('express');
const cors = require('cors');
const sequelize = require('./connection');
const routes = require('./Server/routes');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para debug
app.use((req, res, next) => {
    console.log('Body da requisição:', req.body);
    next();
});

// Rotas
app.use(routes);

// Rota padrão
app.get('/', (req, res) => {
    res.json({ message: 'Bem-vindo à API de Integração de Estudantes!' });
});

// Rota padrão para 404
app.use((req, res) => {
    res.status(404).json({ message: 'Rota não encontrada' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'errado!' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor a correr na porta ${PORT}`);
});
