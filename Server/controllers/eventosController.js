const { Evento, User, Inscricao } = require('../models');

const eventosController = {
    // Criar um novo evento
    createEvento: async (req, res) => {
        try {
            const { nome, descricao, data_inicio, data_fim, local, capacidade, preco, imagem } = req.body;
            const organizador_id = req.user.id;

            // Validações simples
            if (!nome || !descricao || !data_inicio || !data_fim || !local || !capacidade || !preco) {
                return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" });
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

            res.status(201).json(evento);
        } catch (error) {
            console.error('Erro ao criar evento:', error);
            res.status(500).json({ mensagem: "Erro ao criar evento" });
        }
    },

    // Listar todos os eventos
    getAllEventos: async (req, res) => {
        try {
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const eventos = await Evento.findAndCountAll({
                include: [{
                    model: User,
                    as: 'organizador',
                    attributes: ['id', 'username', 'email']
                }],
                limit: +limit,
                offset: +offset
            });

            res.status(200).json({
                total: eventos.count,
                totalPages: Math.ceil(eventos.count / limit),
                currentPage: +page,
                data: eventos.rows
            });
        } catch (error) {
            console.error('Erro ao listar eventos:', error);
            res.status(500).json({ mensagem: "Erro ao listar eventos" });
        }
    },

    // Obter um evento específico
    getEventoById: async (req, res) => {
        try {
            const evento = await Evento.findByPk(req.params.id, {
                include: [{
                    model: User,
                    as: 'organizador',
                    attributes: ['id', 'username', 'email']
                }]
            });

            if (!evento) {
                return res.status(404).json({ mensagem: "Evento não encontrado" });
            }

            res.status(200).json(evento);
        } catch (error) {
            console.error('Erro ao obter evento:', error);
            res.status(500).json({ mensagem: "Erro ao obter evento" });
        }
    },

    // Atualizar um evento
    updateEvento: async (req, res) => {
        try {
            const evento = await Evento.findByPk(req.params.id);
            
            if (!evento) {
                return res.status(404).json({ mensagem: "Evento não encontrado" });
            }

            if (evento.organizador_id !== req.user.id) {
                return res.status(403).json({ mensagem: "Não autorizado" });
            }

            await evento.update(req.body);
            res.status(200).json(evento);
        } catch (error) {
            console.error('Erro ao atualizar evento:', error);
            res.status(500).json({ mensagem: "Erro ao atualizar evento" });
        }
    },

    // Excluir um evento
    deleteEvento: async (req, res) => {
        try {
            const evento = await Evento.findByPk(req.params.id);
            
            if (!evento) {
                return res.status(404).json({ mensagem: "Evento não encontrado" });
            }

            if (evento.organizador_id !== req.user.id) {
                return res.status(403).json({ mensagem: "Não autorizado" });
            }

            await evento.destroy();
            res.status(200).json({ mensagem: "Evento excluído com sucesso" });
        } catch (error) {
            console.error('Erro ao excluir evento:', error);
            res.status(500).json({ mensagem: "Erro ao excluir evento" });
        }
    },

    // Inscrever-se em um evento
    inscreverEmEvento: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const evento = await Evento.findByPk(id);
            
            if (!evento) {
                return res.status(404).json({ mensagem: 'Evento não encontrado' });
            }

            // Verifica se o evento está disponível para inscrições
            if (evento.status !== 'agendado') {
                return res.status(400).json({ 
                    errorMessage: "Este evento não está a aceitar inscrições." 
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
                    errorMessage: "Já se encontra inscrito neste evento." 
                });
            }

            // Cria a inscrição
            const inscricao = await Inscricao.create({
                user_id: userId,
                evento_id: id,
                valor_pago: evento.preco
            });

            return res.status(201).json({
                message: "Inscrição efetuada com sucesso.",
                inscricao
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                errorMessage: "Ocorreu um erro. Por favor, tente novamente mais tarde." 
            });
        }
    },

    // Listar inscritos em um evento (para organizadores)
    getInscritos: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            // Verifica se o user é o organizador do evento
            const evento = await Evento.findByPk(id);
            if (!evento) {
                return res.status(404).json({ mensagem: 'Evento não encontrado' });
            }
            if (evento.organizador_id !== userId) {
                return res.status(403).json({ mensagem: 'Apenas o organizador do evento pode ver as inscrições' });
            }

            const inscricoes = await Inscricao.findAll({
                where: { evento_id: id },
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username', 'email']
                }]
            });

            return res.status(200).json(inscricoes);

        } catch (error) {
            console.error('Erro ao listar inscritos:', error);
            res.status(500).json({ 
                mensagem: 'Erro ao listar inscritos',
                erro: error.message 
            });
        }
    },

    // Atualizar status de inscrição (para organizadores)
    atualizarStatusInscricao: async (req, res) => {
        try {
            const { id, inscricaoId } = req.params;
            const userId = req.user.id;
            const { status } = req.body;

            // Verifica se o user é o organizador do evento associado à inscrição
            const inscricao = await Inscricao.findByPk(inscricaoId, {
                include: [{
                    model: Evento,
                    as: 'evento'
                }]
            });

            if (!inscricao) {
                return res.status(404).json({ mensagem: 'Inscrição não encontrada' });
            }

            if (inscricao.evento.organizador_id !== userId) {
                return res.status(403).json({ mensagem: 'Apenas o organizador do evento pode atualizar o estado da inscrição' });
            }

            // Validações de status (ex: 'pendente', 'confirmada', 'cancelada')
            if (!['pendente', 'confirmada', 'cancelada'].includes(status)) {
                 return res.status(400).json({ 
                    errorMessage: "Estado da inscrição inválido." 
                });
            }

            await inscricao.update({ status });

            return res.status(200).json({
                message: "Estado da inscrição atualizado com sucesso.",
                inscricao
            });

        } catch (error) {
            console.error('Erro ao atualizar status da inscrição:', error);
            res.status(500).json({ 
                mensagem: 'Erro ao atualizar status da inscrição',
                erro: error.message 
            });
        }
    }
};

module.exports = eventosController;
