const { DataTypes } = require('sequelize');
const sequelize = require('../../connection');

const Inscricao = sequelize.define("Inscricao", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    evento_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Eventos',
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('pendente', 'confirmada', 'cancelada'),
        defaultValue: 'pendente'
    },
    data_inscricao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    pagamento_status: {
        type: DataTypes.ENUM('pendente', 'pago', 'reembolsado'),
        defaultValue: 'pendente'
    },
    valor_pago: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    observacoes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Inscricao; 