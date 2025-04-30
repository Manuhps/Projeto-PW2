const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const userRoutes = require('./src/routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rotas
app.use('/users', userRoutes);

// Rota padrão para 404
app.use((req, res) => {
    res.status(404).json({ message: 'Rota não encontrada' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo deu errado!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
