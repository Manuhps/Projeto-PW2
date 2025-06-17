const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = {
    // Middleware para verificar se o usuário está autenticado
    verifyToken: async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                return res.status(401).json({ 
                    message: "Token not provided" 
                });
            }

            const token = authHeader.split(' ')[1]; // Bearer TOKEN

            if (!token) {
                return res.status(401).json({ 
                    message: "Token not provided" 
                });
            }

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findByPk(decoded.id);

                if (!user) {
                    return res.status(401).json({ 
                        message: "User not found" 
                    });
                }

                if (user.isBanned) {
                    return res.status(403).json({ 
                        message: "User is banned" 
                    });
                }

                req.user = user;
                next();
            } catch (error) {
                return res.status(401).json({ 
                    message: "Invalid token" 
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                message: "Error verifying authentication" 
            });
        }
    },

    // Middleware para verificar se o usuário é admin
    isAdmin: (req, res, next) => {
        if (!req.user.isAdmin) {
            return res.status(403).json({ 
                message: "Access denied. Only administrators can access this resource." 
            });
        }
        next();
    },

    // Middleware para verificar se o usuário é estudante
    isEstudante: (req, res, next) => {
        if (req.user.tipo !== 'estudante') {
            return res.status(403).json({ 
                message: "Access denied. Only students can access this resource." 
            });
        }
        next();
    },

    // Middleware para verificar se o usuário é proprietário
    isProprietario: (req, res, next) => {
        if (req.user.tipo !== 'proprietario') {
            return res.status(403).json({ 
                message: "Access denied. Only property owners can access this resource." 
            });
        }
        next();
    },

    // Middleware para verificar se o usuário é organizador
    isOrganizador: (req, res, next) => {
        if (req.user.tipo !== 'organizador') {
            return res.status(403).json({ 
                message: "Access denied. Only event organizers can access this resource." 
            });
        }
        next();
    }
};

module.exports = authMiddleware; 