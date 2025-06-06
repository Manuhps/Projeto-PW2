const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const sequelize = require('./connection');
const routes = require('./Server/routes');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

// Teste da conexão com o banco de dados
sequelize.authenticate()
    .then(() => {
        return sequelize.sync({ alter: true });
    })
    .catch(err => {
        console.error('Erro:', err);
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
    res.status(500).json({ message: 'Algo deu errado!' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
