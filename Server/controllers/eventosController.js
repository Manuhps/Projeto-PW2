const Evento = require('../models/eventoModel');
const User = require('../models/userModel');
const Inscricao = require('../models/inscricaoModel');

const eventosController = {
    // Criar um novo evento
    createEvento: async (req, res) => {
        try {
            const { nome, descricao, data_inicio, data_fim, local, capacidade, preco, imagem } = req.body;
            const organizador_id = req.user.id;

            // Verifica se o usuário é um organizador
            const user = await User.findByPk(organizador_id);
            if (!user || user.tipo !== 'organizador') {
                return res.status(403).json({ 
                    message: "Apenas organizadores podem criar eventos" 
                });
            }

            // Validações básicas
            if (!nome || !descricao || !data_inicio || !data_fim || !local || !capacidade || !preco) {
                return res.status(400).json({ 
                    message: "Todos os campos obrigatórios devem ser preenchidos" 
                });
            }

            // Validação de datas
            if (new Date(data_inicio) >= new Date(data_fim)) {
                return res.status(400).json({ 
                    message: "A data de início deve ser anterior à data de fim" 
                });
            }

            const evento = await Evento.create({
                nome,
                descricao,
                data_inicio,
                data_fim,
                local,
                capacidade,
                preco,
                organizador_id,
                imagem
            });

            return res.status(201).json({
                message: "Evento criado com sucesso",
                evento
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                message: "Erro ao criar evento" 
            });
        }
    },

    // Listar todos os eventos
    getAllEventos: async (req, res) => {
        try {
            const { status, limit = 10, page = 0 } = req.query;
            
            const where = {};
            if (status) where.status = status;

            const eventos = await Evento.findAndCountAll({
                where,
                limit: parseInt(limit),
                offset: parseInt(page) * parseInt(limit),
                include: [{
                    model: User,
                    as: 'organizador',
                    attributes: ['id', 'username', 'email']
                }]
            });

            return res.status(200).json({
                total: eventos.count,
                totalPages: Math.ceil(eventos.count / limit),
                currentPage: parseInt(page),
                eventos: eventos.rows
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                message: "Erro ao listar eventos" 
            });
        }
    },

    // Obter um evento específico
    getEventoById: async (req, res) => {
        try {
            const { id } = req.params;

            const evento = await Evento.findByPk(id, {
                include: [{
                    model: User,
                    as: 'organizador',
                    attributes: ['id', 'username', 'email']
                }]
            });

            if (!evento) {
                return res.status(404).json({ 
                    message: "Evento não encontrado" 
                });
            }

            return res.status(200).json(evento);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                message: "Erro ao buscar evento" 
            });
        }
    },

    // Atualizar um evento
    updateEvento: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const updateData = req.body;

            const evento = await Evento.findByPk(id);
            
            if (!evento) {
                return res.status(404).json({ 
                    message: "Evento não encontrado" 
                });
            }

            // Verifica se o usuário é o organizador do evento
            if (evento.organizador_id !== userId) {
                return res.status(403).json({ 
                    message: "Apenas o organizador pode atualizar este evento" 
                });
            }

            await evento.update(updateData);

            return res.status(200).json({
                message: "Evento atualizado com sucesso",
                evento
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                message: "Erro ao atualizar evento" 
            });
        }
    },

    // Deletar um evento
    deleteEvento: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const evento = await Evento.findByPk(id);
            
            if (!evento) {
                return res.status(404).json({ 
                    message: "Evento não encontrado" 
                });
            }

            // Verifica se o usuário é o organizador do evento
            if (evento.organizador_id !== userId) {
                return res.status(403).json({ 
                    message: "Apenas o organizador pode deletar este evento" 
                });
            }

            await evento.destroy();

            return res.status(200).json({
                message: "Evento deletado com sucesso"
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                message: "Erro ao deletar evento" 
            });
        }
    },

    // Inscrever-se em um evento
    inscreverEmEvento: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const evento = await Evento.findByPk(id);
            
            if (!evento) {
                return res.status(404).json({ 
                    message: "Evento não encontrado" 
                });
            }

            // Verifica se o evento está disponível para inscrições
            if (evento.status !== 'agendado') {
                return res.status(400).json({ 
                    message: "Este evento não está aceitando inscrições" 
                });
            }

            // Verifica se já existe uma inscrição
            const inscricaoExistente = await Inscricao.findOne({
                where: {
                    user_id: userId,
                    evento_id: id
                }
            });

            if (inscricaoExistente) {
                return res.status(400).json({ 
                    message: "Você já está inscrito neste evento" 
                });
            }

            // Cria a inscrição
            const inscricao = await Inscricao.create({
                user_id: userId,
                evento_id: id,
                valor_pago: evento.preco
            });

            return res.status(201).json({
                message: "Inscrição realizada com sucesso",
                inscricao
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                message: "Erro ao realizar inscrição" 
            });
        }
    }
};

module.exports = eventosController;
