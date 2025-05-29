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
        type: DataTypes.ENUM('admin', 'proprietario', 'organizador', 'user'),
        defaultValue: 'user'
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
    updatedAt: 'updated_at'
});

module.exports = User; 