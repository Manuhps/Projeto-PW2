const { Avaliacao, User, Alojamento, Evento } = require('../models');

const avaliacoesController = {
    // Criar uma nova avaliação
    createAvaliacao: async (req, res) => {
        try {
            const { alojamento_id, evento_id, pontuacao, comentario } = req.body;
            const user_id = req.user.id;

            // Validações: precisa de nota e um ID de alojamento ou evento
            if (!pontuacao) {
                return res.status(400).json({ mensagem: "Pontuação é obrigatória" });
            }

            if (!alojamento_id && !evento_id) {
                return res.status(400).json({ mensagem: "É necessário fornecer um ID de alojamento ou de evento" });
            }

            if (alojamento_id && evento_id) {
                return res.status(400).json({ mensagem: "A avaliação deve ser para um alojamento OU um evento, não para ambos." });
            }

            // Verificar se o usuário já avaliou este item específico
            const whereClause = { user_id };
            if (alojamento_id) {
                whereClause.alojamento_id = alojamento_id;
            } else if (evento_id) {
                whereClause.evento_id = evento_id;
            }

            const avaliacaoExistente = await Avaliacao.findOne({
                where: whereClause
            });

            if (avaliacaoExistente) {
                return res.status(400).json({ mensagem: "Você já avaliou este item" });
            }

            const avaliacao = await Avaliacao.create({
                user_id,
                alojamento_id,
                evento_id,
                pontuacao,
                comentario
            });

            res.status(201).json(avaliacao);
        } catch (error) {
            console.error('Erro ao criar avaliação:', error);
            res.status(500).json({ mensagem: "Erro ao criar avaliação" });
        }
    },

    // Listar todas as avaliações
    getAllAvaliacoes: async (req, res) => {
        try {
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const avaliacoes = await Avaliacao.findAndCountAll({
                include: [
                    {
                        model: User,
                        as: 'usuario',
                        attributes: ['id', 'username']
                    },
                    {
                        model: Alojamento,
                        as: 'alojamento',
                        attributes: ['id', 'nome']
                    },
                    {
                        model: Evento,
                        as: 'evento',
                        attributes: ['id', 'nome']
                    }
                ],
                limit: +limit,
                offset: +offset
            });

            res.status(200).json({
                total: avaliacoes.count,
                totalPages: Math.ceil(avaliacoes.count / limit),
                currentPage: +page,
                data: avaliacoes.rows
            });
        } catch (error) {
            console.error('Erro ao listar avaliações:', error);
            res.status(500).json({ mensagem: "Erro ao listar avaliações" });
        }
    },

    // Obter uma avaliação específica
    getAvaliacaoById: async (req, res) => {
        try {
            const avaliacao = await Avaliacao.findByPk(req.params.id, {
                include: [
                    {
                        model: User,
                        as: 'usuario',
                        attributes: ['id', 'username']
                    },
                    {
                        model: Alojamento,
                        as: 'alojamento',
                        attributes: ['id', 'nome']
                    },
                    {
                        model: Evento,
                        as: 'evento',
                        attributes: ['id', 'nome']
                    }
                ]
            });

            if (!avaliacao) {
                return res.status(404).json({ mensagem: "Avaliação não encontrada" });
            }

            res.status(200).json(avaliacao);
        } catch (error) {
            console.error('Erro ao obter avaliação:', error);
            res.status(500).json({ mensagem: "Erro ao obter avaliação" });
        }
    },

    // Atualizar uma avaliação
    updateAvaliacao: async (req, res) => {
        try {
            const avaliacao = await Avaliacao.findByPk(req.params.id);
            
            if (!avaliacao) {
                return res.status(404).json({ mensagem: "Avaliação não encontrada" });
            }

            if (avaliacao.user_id !== req.user.id) {
                return res.status(403).json({ mensagem: "Não autorizado" });
            }

            const { pontuacao, comentario } = req.body;
            await avaliacao.update({ pontuacao, comentario });
            
            res.status(200).json(avaliacao);
        } catch (error) {
            console.error('Erro ao atualizar avaliação:', error);
            res.status(500).json({ mensagem: "Erro ao atualizar avaliação" });
        }
    },

    // Excluir uma avaliação
    deleteAvaliacao: async (req, res) => {
        try {
            const avaliacao = await Avaliacao.findByPk(req.params.id);
            
            if (!avaliacao) {
                return res.status(404).json({ mensagem: "Avaliação não encontrada" });
            }

            if (avaliacao.user_id !== req.user.id) {
                return res.status(403).json({ mensagem: "Não autorizado" });
            }

            await avaliacao.destroy();
            res.status(200).json({ mensagem: "Avaliação excluída com sucesso" });
        } catch (error) {
            console.error('Erro ao excluir avaliação:', error);
            res.status(500).json({ mensagem: "Erro ao excluir avaliação" });
        }
    },

    // Listar avaliações de um alojamento específico
    getAvaliacoesAlojamento: async (req, res) => {
        try {
            const { alojamento_id } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const avaliacoes = await Avaliacao.findAndCountAll({
                where: {
                    alojamento_id
                },
                include: [
                    {
                        model: User,
                        as: 'usuario',
                        attributes: ['id', 'username']
                    }
                ],
                limit: +limit,
                offset: +offset
            });

            res.status(200).json({
                total: avaliacoes.count,
                totalPages: Math.ceil(avaliacoes.count / limit),
                currentPage: +page,
                data: avaliacoes.rows
            });
        } catch (error) {
            console.error('Erro ao listar avaliações do alojamento:', error);
            res.status(500).json({ mensagem: "Erro ao listar avaliações do alojamento" });
        }
    },

    // Listar avaliações de um evento específico
    getAvaliacoesEvento: async (req, res) => {
        try {
            const { evento_id } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const avaliacoes = await Avaliacao.findAndCountAll({
                where: {
                    evento_id
                },
                include: [
                    {
                        model: User,
                        as: 'usuario',
                        attributes: ['id', 'username']
                    }
                ],
                limit: +limit,
                offset: +offset
            });

            res.status(200).json({
                total: avaliacoes.count,
                totalPages: Math.ceil(avaliacoes.count / limit),
                currentPage: +page,
                data: avaliacoes.rows
            });
        } catch (error) {
            console.error('Erro ao listar avaliações do evento:', error);
            res.status(500).json({ mensagem: "Erro ao listar avaliações do evento" });
        }
    }
};

module.exports = avaliacoesController; 