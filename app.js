const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const sequelize = require('./connection');
const routes = require('./Server/routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Teste da conexão com o banco de dados
sequelize.authenticate()
    .then(() => {
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
        // Sincroniza os modelos com a base de dados
        return sequelize.sync({ alter: true });
    })
    .then(() => {
        console.log('Modelos sincronizados com sucesso.');
    })
    .catch(err => {
        console.error('Erro:', err);
    });

// Rotas
app.use('/api', routes);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
