const Alojamento = require('../models/alojamentoModel');
const User = require('../models/userModel');
const Reserva = require('../models/reservaModel');

const alojamentosController = {
    // Criar um novo alojamento
    createAlojamento: async (req, res) => {
        try {
            const { nome, descricao, endereco, capacidade, preco, imagens, comodidades, regras } = req.body;
            const proprietario_id = req.user.id;

            // Verifica se o usuário é um proprietário
            const user = await User.findByPk(proprietario_id);
            if (!user || user.tipo !== 'proprietario') {
                return res.status(403).json({ 
                    message: "Apenas proprietários podem criar alojamentos" 
                });
            }

            // Validações básicas
            if (!nome || !descricao || !endereco || !capacidade || !preco) {
                return res.status(400).json({ 
                    message: "Todos os campos obrigatórios devem ser preenchidos" 
                });
            }

            const alojamento = await Alojamento.create({
                nome,
                descricao,
                endereco,
                capacidade,
                preco,
                imagens: imagens || [],
                comodidades: comodidades || [],
                regras,
                proprietario_id
            });

            return res.status(201).json({
                message: "Alojamento criado com sucesso",
                alojamento
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                message: "Erro ao criar alojamento" 
            });
        }
    },

    // Listar todos os alojamentos
    getAllAlojamentos: async (req, res) => {
        try {
            const { disponivel, limit = 10, page = 0 } = req.query;
            
            const where = {};
            if (disponivel !== undefined) where.disponivel = disponivel === 'true';

            const alojamentos = await Alojamento.findAndCountAll({
                where,
                limit: parseInt(limit),
                offset: parseInt(page) * parseInt(limit),
                include: [{
                    model: User,
                    as: 'proprietario',
                    attributes: ['id', 'username', 'email']
                }]
            });

            return res.status(200).json({
                total: alojamentos.count,
                totalPages: Math.ceil(alojamentos.count / limit),
                currentPage: parseInt(page),
                alojamentos: alojamentos.rows
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                message: "Erro ao listar alojamentos" 
            });
        }
    },

    // Obter um alojamento específico
    getAlojamentoById: async (req, res) => {
        try {
            const { id } = req.params;

            const alojamento = await Alojamento.findByPk(id, {
                include: [{
                    model: User,
                    as: 'proprietario',
                    attributes: ['id', 'username', 'email']
                }]
            });

            if (!alojamento) {
                return res.status(404).json({ 
                    message: "Alojamento não encontrado" 
                });
            }

            return res.status(200).json(alojamento);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                message: "Erro ao buscar alojamento" 
            });
        }
    },

    // Atualizar um alojamento
    updateAlojamento: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const updateData = req.body;

            const alojamento = await Alojamento.findByPk(id);
            
            if (!alojamento) {
                return res.status(404).json({ 
                    message: "Alojamento não encontrado" 
                });
            }

            // Verifica se o usuário é o proprietário do alojamento
            if (alojamento.proprietario_id !== userId) {
                return res.status(403).json({ 
                    message: "Apenas o proprietário pode atualizar este alojamento" 
                });
            }

            await alojamento.update(updateData);

            return res.status(200).json({
                message: "Alojamento atualizado com sucesso",
                alojamento
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                message: "Erro ao atualizar alojamento" 
            });
        }
    },

    // Deletar um alojamento
    deleteAlojamento: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const alojamento = await Alojamento.findByPk(id);
            
            if (!alojamento) {
                return res.status(404).json({ 
                    message: "Alojamento não encontrado" 
                });
            }

            // Verifica se o usuário é o proprietário do alojamento
            if (alojamento.proprietario_id !== userId) {
                return res.status(403).json({ 
                    message: "Apenas o proprietário pode deletar este alojamento" 
                });
            }

            await alojamento.destroy();

            return res.status(200).json({
                message: "Alojamento deletado com sucesso"
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                message: "Erro ao deletar alojamento" 
            });
        }
    },

    // Fazer uma reserva
    fazerReserva: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const { data_inicio, data_fim } = req.body;

            const alojamento = await Alojamento.findByPk(id);
            
            if (!alojamento) {
                return res.status(404).json({ 
                    message: "Alojamento não encontrado" 
                });
            }

            if (!alojamento.disponivel) {
                return res.status(400).json({ 
                    message: "Este alojamento não está disponível para reservas" 
                });
            }

            // Verifica se já existe uma reserva para o período
            const reservaExistente = await Reserva.findOne({
                where: {
                    alojamento_id: id,
                    status: 'confirmada',
                    [Op.or]: [
                        {
                            data_inicio: {
                                [Op.between]: [data_inicio, data_fim]
                            }
                        },
                        {
                            data_fim: {
                                [Op.between]: [data_inicio, data_fim]
                            }
                        }
                    ]
                }
            });

            if (reservaExistente) {
                return res.status(400).json({ 
                    message: "Já existe uma reserva para este período" 
                });
            }

            // Calcula o valor total da reserva
            const dias = Math.ceil((new Date(data_fim) - new Date(data_inicio)) / (1000 * 60 * 60 * 24));
            const valor_total = dias * alojamento.preco;

            // Cria a reserva
            const reserva = await Reserva.create({
                user_id: userId,
                alojamento_id: id,
                data_inicio,
                data_fim,
                valor_total
            });

            return res.status(201).json({
                message: "Reserva realizada com sucesso",
                reserva
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                message: "Erro ao realizar reserva" 
            });
        }
    }
};

module.exports = alojamentosController;
