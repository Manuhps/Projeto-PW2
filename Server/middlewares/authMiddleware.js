const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = {
    // Middleware para verificar se o usuário está autenticado
    verifyToken: async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                return res.status(401).json({ 
                    message: "Token não fornecido" 
                });
            }

            const token = authHeader.split(' ')[1]; // Bearer TOKEN

            if (!token) {
                return res.status(401).json({ 
                    message: "Token não fornecido" 
                });
            }

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findByPk(decoded.id);

                if (!user) {
                    return res.status(401).json({ 
                        message: "Usuário não encontrado" 
                    });
                }

                if (user.isBanned) {
                    return res.status(403).json({ 
                        message: "Usuário está banido" 
                    });
                }

                req.user = user;
                next();
            } catch (error) {
                return res.status(401).json({ 
                    message: "Token inválido" 
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                message: "Erro ao verificar autenticação" 
            });
        }
    },

    // Middleware para verificar se o usuário é admin
    isAdmin: (req, res, next) => {
        if (!req.user.isAdmin) {
            return res.status(403).json({ 
                message: "Acesso negado. Apenas administradores podem acessar este recurso." 
            });
        }
        next();
    },

    // Middleware para verificar se o usuário é proprietário
    isProprietario: (req, res, next) => {
        if (req.user.tipo !== 'proprietario') {
            return res.status(403).json({ 
                message: "Acesso negado. Apenas proprietários podem acessar este recurso." 
            });
        }
        next();
    },

    // Middleware para verificar se o usuário é organizador
    isOrganizador: (req, res, next) => {
        if (req.user.tipo !== 'organizador') {
            return res.status(403).json({ 
                message: "Acesso negado. Apenas organizadores podem acessar este recurso." 
            });
        }
        next();
    },

    // Middleware para verificar se o usuário é o dono do recurso ou admin
    isOwnerOrAdmin: (req, res, next) => {
        const resourceId = req.params.id;
        if (req.user.id !== parseInt(resourceId) && !req.user.isAdmin) {
            return res.status(403).json({ 
                message: "Acesso negado. Você não tem permissão para acessar este recurso." 
            });
        }
        next();
    }
};

module.exports = authMiddleware; 