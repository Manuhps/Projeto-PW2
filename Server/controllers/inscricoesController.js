const { Inscricao, Evento, User } = require('../models');

const inscricoesController = {
    // Criar uma nova inscrição
    createInscricao: async (req, res) => {
        try {
            const { evento_id } = req.body;
            const user_id = req.user.id;

            if (!evento_id) {
                return res.status(400).json({ mensagem: "Evento é obrigatório" });
            }

            const inscricao = await Inscricao.create({
                evento_id,
                user_id,
                status: 'pendente'
            });

            res.status(201).json(inscricao);
        } catch (error) {
            console.error('Erro ao criar inscrição:', error);
            res.status(500).json({ mensagem: "Erro ao criar inscrição" });
        }
    },

    // Listar todas as inscrições
    getAllInscricoes: async (req, res) => {
        try {
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const inscricoes = await Inscricao.findAndCountAll({
                include: [
                    {
                        model: User,
                        as: 'usuario',
                        attributes: ['id', 'username', 'email']
                    },
                    {
                        model: Evento,
                        as: 'evento',
                        attributes: ['id', 'nome', 'data_inicio']
                    }
                ],
                limit: +limit,
                offset: +offset
            });

            res.status(200).json({
                total: inscricoes.count,
                totalPages: Math.ceil(inscricoes.count / limit),
                currentPage: +page,
                data: inscricoes.rows
            });
        } catch (error) {
            console.error('Erro ao listar inscrições:', error);
            res.status(500).json({ mensagem: "Erro ao listar inscrições" });
        }
    },

    // Obter uma inscrição específica
    getInscricaoById: async (req, res) => {
        try {
            const inscricao = await Inscricao.findByPk(req.params.id, {
                include: [
                    {
                        model: User,
                        as: 'usuario',
                        attributes: ['id', 'username', 'email']
                    },
                    {
                        model: Evento,
                        as: 'evento',
                        attributes: ['id', 'nome', 'data_inicio']
                    }
                ]
            });

            if (!inscricao) {
                return res.status(404).json({ mensagem: "Inscrição não encontrada" });
            }

            res.status(200).json(inscricao);
        } catch (error) {
            console.error('Erro ao obter inscrição:', error);
            res.status(500).json({ mensagem: "Erro ao obter inscrição" });
        }
    },

    // Atualizar uma inscrição
    updateInscricao: async (req, res) => {
        try {
            const inscricao = await Inscricao.findByPk(req.params.id);
            
            if (!inscricao) {
                return res.status(404).json({ mensagem: "Inscrição não encontrada" });
            }

            if (inscricao.user_id !== req.user.id) {
                return res.status(403).json({ mensagem: "Não autorizado" });
            }

            await inscricao.update(req.body);
            res.status(200).json(inscricao);
        } catch (error) {
            console.error('Erro ao atualizar inscrição:', error);
            res.status(500).json({ mensagem: "Erro ao atualizar inscrição" });
        }
    },

    // Excluir uma inscrição
    deleteInscricao: async (req, res) => {
        try {
            const inscricao = await Inscricao.findByPk(req.params.id);
            
            if (!inscricao) {
                return res.status(404).json({ mensagem: "Inscrição não encontrada" });
            }

            if (inscricao.user_id !== req.user.id) {
                return res.status(403).json({ mensagem: "Não autorizado" });
            }

            await inscricao.destroy();
            res.status(200).json({ mensagem: "Inscrição excluída com sucesso" });
        } catch (error) {
            console.error('Erro ao excluir inscrição:', error);
            res.status(500).json({ mensagem: "Erro ao excluir inscrição" });
        }
    }
};

module.exports = inscricoesController; 