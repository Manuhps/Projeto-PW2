const Reserva = require('../models/reservaModel');
const Alojamento = require('../models/alojamentoModel');
const User = require('../models/userModel');
const { Op } = require('sequelize');

const reservasController = {
    // Listar todas as reservas do usuário
    getMinhasReservas: async (req, res) => {
        try {
            const userId = req.user.id;
            const { status, limit = 10, page = 0 } = req.query;

            const where = { user_id: userId };
            if (status) where.status = status;

            const reservas = await Reserva.findAndCountAll({
                where,
                limit: parseInt(limit),
                offset: parseInt(page) * parseInt(limit),
                include: [{
                    model: Alojamento,
                    as: 'alojamento',
                    include: [{
                        model: User,
                        as: 'proprietario',
                        attributes: ['id', 'username', 'email']
                    }]
                }]
            });

            return res.status(200).json({
                total: reservas.count,
                totalPages: Math.ceil(reservas.count / limit),
                currentPage: parseInt(page),
                reservas: reservas.rows
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                message: "Erro ao listar reservas" 
            });
        }
    },

    // Listar todas as reservas de um alojamento (para proprietários)
    getReservasAlojamento: async (req, res) => {
        try {
            const { alojamentoId } = req.params;
            const userId = req.user.id;
            const { status, limit = 10, page = 0 } = req.query;

            // Verifica se o usuário é o proprietário do alojamento
            const alojamento = await Alojamento.findByPk(alojamentoId);
            if (!alojamento || alojamento.proprietario_id !== userId) {
                return res.status(403).json({ 
                    message: "Apenas o proprietário pode ver as reservas deste alojamento" 
                });
            }

            const where = { alojamento_id: alojamentoId };
            if (status) where.status = status;

            const reservas = await Reserva.findAndCountAll({
                where,
                limit: parseInt(limit),
                offset: parseInt(page) * parseInt(limit),
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username', 'email']
                }]
            });

            return res.status(200).json({
                total: reservas.count,
                totalPages: Math.ceil(reservas.count / limit),
                currentPage: parseInt(page),
                reservas: reservas.rows
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                message: "Erro ao listar reservas" 
            });
        }
    },

    // Obter detalhes de uma reserva específica
    getReservaById: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const reserva = await Reserva.findByPk(id, {
                include: [
                    {
                        model: Alojamento,
                        as: 'alojamento',
                        include: [{
                            model: User,
                            as: 'proprietario',
                            attributes: ['id', 'username', 'email']
                        }]
                    },
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'username', 'email']
                    }
                ]
            });

            if (!reserva) {
                return res.status(404).json({ 
                    message: "Reserva não encontrada" 
                });
            }

            // Verifica se o usuário tem permissão para ver a reserva
            if (reserva.user_id !== userId && reserva.alojamento.proprietario_id !== userId) {
                return res.status(403).json({ 
                    message: "Você não tem permissão para ver esta reserva" 
                });
            }

            return res.status(200).json(reserva);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                message: "Erro ao buscar reserva" 
            });
        }
    },

    // Atualizar status de uma reserva
    updateReservaStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const { status } = req.body;

            const reserva = await Reserva.findByPk(id, {
                include: [{
                    model: Alojamento,
                    as: 'alojamento'
                }]
            });

            if (!reserva) {
                return res.status(404).json({ 
                    message: "Reserva não encontrada" 
                });
            }

            // Verifica se o usuário tem permissão para atualizar a reserva
            if (reserva.user_id !== userId && reserva.alojamento.proprietario_id !== userId) {
                return res.status(403).json({ 
                    message: "Você não tem permissão para atualizar esta reserva" 
                });
            }

            // Validações de status
            if (!['pendente', 'confirmada', 'cancelada', 'concluida'].includes(status)) {
                return res.status(400).json({ 
                    message: "Status inválido" 
                });
            }

            // Apenas o proprietário pode confirmar ou cancelar uma reserva
            if (['confirmada', 'cancelada'].includes(status) && reserva.alojamento.proprietario_id !== userId) {
                return res.status(403).json({ 
                    message: "Apenas o proprietário pode confirmar ou cancelar uma reserva" 
                });
            }

            // Apenas o usuário que fez a reserva pode cancelá-la se estiver pendente
            if (status === 'cancelada' && reserva.user_id === userId && reserva.status !== 'pendente') {
                return res.status(403).json({ 
                    message: "Você só pode cancelar reservas pendentes" 
                });
            }

            await reserva.update({ status });

            return res.status(200).json({
                message: "Status da reserva atualizado com sucesso",
                reserva
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                message: "Erro ao atualizar status da reserva" 
            });
        }
    },

    // Atualizar status de pagamento
    updatePagamentoStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const { pagamento_status } = req.body;

            const reserva = await Reserva.findByPk(id, {
                include: [{
                    model: Alojamento,
                    as: 'alojamento'
                }]
            });

            if (!reserva) {
                return res.status(404).json({ 
                    message: "Reserva não encontrada" 
                });
            }

            // Verifica se o usuário tem permissão para atualizar o status de pagamento
            if (reserva.user_id !== userId && reserva.alojamento.proprietario_id !== userId) {
                return res.status(403).json({ 
                    message: "Você não tem permissão para atualizar o status de pagamento" 
                });
            }

            // Validações de status de pagamento
            if (!['pendente', 'pago', 'reembolsado'].includes(pagamento_status)) {
                return res.status(400).json({ 
                    message: "Status de pagamento inválido" 
                });
            }

            // Apenas o proprietário pode marcar como pago
            if (pagamento_status === 'pago' && reserva.alojamento.proprietario_id !== userId) {
                return res.status(403).json({ 
                    message: "Apenas o proprietário pode marcar o pagamento como realizado" 
                });
            }

            await reserva.update({ pagamento_status });

            return res.status(200).json({
                message: "Status de pagamento atualizado com sucesso",
                reserva
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                message: "Erro ao atualizar status de pagamento" 
            });
        }
    }
};

module.exports = reservasController;
