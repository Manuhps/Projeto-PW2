const errorMiddleware = {
    // Middleware para tratar erros 404 (Not Found)
    notFound: (req, res, next) => {
        const error = new Error(`Não encontrado - ${req.originalUrl}`);
        res.status(404);
        next(error);
    },

    // Middleware para tratar erros gerais
    errorHandler: (err, req, res, next) => {
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        
        // Log do erro para debugging
        console.error('Erro:', {
            message: err.message,
            stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
            path: req.path,
            method: req.method,
            body: req.body,
            params: req.params,
            query: req.query
        });

        res.status(statusCode).json({
            message: err.message,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack
        });
    },

    // Middleware para tratar erros de validação do Sequelize
    sequelizeErrorHandler: (err, req, res, next) => {
        if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
            const errors = err.errors.map(error => ({
                field: error.path,
                message: error.message
            }));

            return res.status(400).json({
                message: 'Erro de validação',
                errors
            });
        }
        next(err);
    },

    // Middleware para tratar erros de autenticação
    authErrorHandler: (err, req, res, next) => {
        if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: 'Não autorizado'
            });
        }
        next(err);
    }
};

module.exports = errorMiddleware; 