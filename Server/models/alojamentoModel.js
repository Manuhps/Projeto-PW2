const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Alojamento = sequelize.define("Alojamento", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    endereco: {
        type: DataTypes.STRING,
        allowNull: false
    },
    capacidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    preco: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    disponivel: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    imagens: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    comodidades: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    regras: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Alojamento; 