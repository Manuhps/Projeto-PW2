require('dotenv').config()
const { Sequelize } = require("sequelize")

const db_name = process.env.DB_NAME
const db_user = process.env.DB_USER
const db_password = process.env.DB_PASSWORD
const db_host = process.env.DB_HOST
const db_dialect = 'mysql'

const sequelize = new Sequelize(db_name, db_user, db_password, {
    host: db_host,
    dialect: db_dialect,
    logging: false
});

// Testar a conexão e sincronizar modelos
sequelize.authenticate()
    .then(() => {
        console.log('Conexão com a base de dados estabelecida com sucesso.');
        return sequelize.sync({ alter: true });
    })
    .then(() => {
        console.log('Modelos sincronizados com a base de dados.');
    })
    .catch(err => {
        console.error('Erro ao conectar ou sincronizar a base de dados:', err);
    });

module.exports = sequelize