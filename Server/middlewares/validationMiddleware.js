const { body, param, query, validationResult } = require('express-validator');

const validationMiddleware = {
    // Validações para usuários
    validateUser: {
        register: [
            body('username')
                .trim()
                .isLength({ min: 2, max: 30 })
                .withMessage('O nome de usuário deve ter entre 2 e 30 caracteres'),
            body('email')
                .trim()
                .isEmail()
                .withMessage('Email inválido'),
            body('password')
                .isLength({ min: 6 })
                .withMessage('A senha deve ter no mínimo 6 caracteres'),
            body('tipo')
                .optional()
                .isIn(['proprietario', 'organizador', 'user'])
                .withMessage('Tipo de usuário inválido')
        ],
        login: [
            body('email')
                .trim()
                .isEmail()
                .withMessage('Email inválido'),
            body('password')
                .notEmpty()
                .withMessage('Senha é obrigatória')
        ],
        update: [
            body('username')
                .optional()
                .trim()
                .isLength({ min: 2, max: 30 })
                .withMessage('O nome de usuário deve ter entre 2 e 30 caracteres'),
            body('email')
                .optional()
                .trim()
                .isEmail()
                .withMessage('Email inválido'),
            body('password')
                .optional()
                .isLength({ min: 6 })
                .withMessage('A senha deve ter no mínimo 6 caracteres'),
            body('tipo')
                .optional()
                .isIn(['proprietario', 'organizador', 'user'])
                .withMessage('Tipo de usuário inválido')
        ]
    },

    // Validações para eventos
    validateEvento: {
        create: [
            body('nome')
                .trim()
                .notEmpty()
                .withMessage('Nome é obrigatório'),
            body('descricao')
                .trim()
                .notEmpty()
                .withMessage('Descrição é obrigatória'),
            body('data_inicio')
                .isISO8601()
                .withMessage('Data de início inválida'),
            body('data_fim')
                .isISO8601()
                .withMessage('Data de fim inválida'),
            body('local')
                .trim()
                .notEmpty()
                .withMessage('Local é obrigatório'),
            body('capacidade')
                .isInt({ min: 1 })
                .withMessage('Capacidade deve ser maior que 0'),
            body('preco')
                .isFloat({ min: 0 })
                .withMessage('Preço deve ser maior ou igual a 0'),
            body('imagem')
                .optional()
                .isURL()
                .withMessage('URL da imagem inválida')
        ],
        update: [
            param('id')
                .isInt()
                .withMessage('ID inválido'),
            body('nome')
                .optional()
                .trim()
                .notEmpty()
                .withMessage('Nome não pode ser vazio'),
            body('descricao')
                .optional()
                .trim()
                .notEmpty()
                .withMessage('Descrição não pode ser vazia'),
            body('data_inicio')
                .optional()
                .isISO8601()
                .withMessage('Data de início inválida'),
            body('data_fim')
                .optional()
                .isISO8601()
                .withMessage('Data de fim inválida'),
            body('local')
                .optional()
                .trim()
                .notEmpty()
                .withMessage('Local não pode ser vazio'),
            body('capacidade')
                .optional()
                .isInt({ min: 1 })
                .withMessage('Capacidade deve ser maior que 0'),
            body('preco')
                .optional()
                .isFloat({ min: 0 })
                .withMessage('Preço deve ser maior ou igual a 0'),
            body('imagem')
                .optional()
                .isURL()
                .withMessage('URL da imagem inválida')
        ]
    },

    // Validações para alojamentos
    validateAlojamento: {
        create: [
            body('nome')
                .trim()
                .notEmpty()
                .withMessage('Nome é obrigatório'),
            body('descricao')
                .trim()
                .notEmpty()
                .withMessage('Descrição é obrigatória'),
            body('endereco')
                .trim()
                .notEmpty()
                .withMessage('Endereço é obrigatório'),
            body('capacidade')
                .isInt({ min: 1 })
                .withMessage('Capacidade deve ser maior que 0'),
            body('preco')
                .isFloat({ min: 0 })
                .withMessage('Preço deve ser maior ou igual a 0'),
            body('imagens')
                .optional()
                .isArray()
                .withMessage('Imagens deve ser um array'),
            body('comodidades')
                .optional()
                .isArray()
                .withMessage('Comodidades deve ser um array'),
            body('regras')
                .optional()
                .trim()
                .notEmpty()
                .withMessage('Regras não pode ser vazio')
        ],
        update: [
            param('id')
                .isInt()
                .withMessage('ID inválido'),
            body('nome')
                .optional()
                .trim()
                .notEmpty()
                .withMessage('Nome não pode ser vazio'),
            body('descricao')
                .optional()
                .trim()
                .notEmpty()
                .withMessage('Descrição não pode ser vazia'),
            body('endereco')
                .optional()
                .trim()
                .notEmpty()
                .withMessage('Endereço não pode ser vazio'),
            body('capacidade')
                .optional()
                .isInt({ min: 1 })
                .withMessage('Capacidade deve ser maior que 0'),
            body('preco')
                .optional()
                .isFloat({ min: 0 })
                .withMessage('Preço deve ser maior ou igual a 0'),
            body('imagens')
                .optional()
                .isArray()
                .withMessage('Imagens deve ser um array'),
            body('comodidades')
                .optional()
                .isArray()
                .withMessage('Comodidades deve ser um array'),
            body('regras')
                .optional()
                .trim()
                .notEmpty()
                .withMessage('Regras não pode ser vazio')
        ]
    },

    // Validações para reservas
    validateReserva: {
        create: [
            body('data_inicio')
                .isISO8601()
                .withMessage('Data de início inválida'),
            body('data_fim')
                .isISO8601()
                .withMessage('Data de fim inválida')
        ],
        update: [
            param('id')
                .isInt()
                .withMessage('ID inválido'),
            body('status')
                .isIn(['pendente', 'confirmada', 'cancelada', 'concluida'])
                .withMessage('Status inválido'),
            body('pagamento_status')
                .optional()
                .isIn(['pendente', 'pago', 'reembolsado'])
                .withMessage('Status de pagamento inválido')
        ]
    },

    // Middleware para verificar erros de validação
    validate: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                errors: errors.array() 
            });
        }
        next();
    }
};

module.exports = validationMiddleware; 