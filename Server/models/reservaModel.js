const { DataTypes } = require('sequelize');
const sequelize = require('../../connection');

const Reserva = sequelize.define("Reserva", {
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
    alojamento_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Alojamentos',
            key: 'id'
        }
    },
    data_inicio: {
        type: DataTypes.DATE,
        allowNull: false
    },
    data_fim: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pendente', 'confirmada', 'cancelada', 'concluida'),
        defaultValue: 'pendente'
    },
    valor_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    pagamento_status: {
        type: DataTypes.ENUM('pendente', 'pago', 'reembolsado'),
        defaultValue: 'pendente'
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

module.exports = Reserva; 