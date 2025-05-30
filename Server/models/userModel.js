const { DataTypes } = require('sequelize');
const sequelize = require('../../connection');
const bcrypt = require('bcryptjs');

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 30]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            const hashedPassword = bcrypt.hashSync(value, 10);
            this.setDataValue('password', hashedPassword);
        }
    },
    tipo: {
        type: DataTypes.ENUM('proprietario', 'organizador', 'user'),
        defaultValue: 'user',
        allowNull: false
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    isBanned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    profileImg: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: true
        }
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        beforeUpdate: async (user) => {
            // Verifica se está tentando alterar o status de admin
            if (user.changed('isAdmin')) {
                // Aqui você pode adicionar uma lógica para verificar se o usuário que está fazendo a alteração é admin
                // Isso deve ser implementado no controller
                throw new Error('Apenas administradores podem alterar o status de admin de um usuário');
            }
        }
    }
});

module.exports = User; 