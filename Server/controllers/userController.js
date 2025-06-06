const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ 
                    errorMessage: "Por favor, forneça email e password." 
                });
            }

            const user = await User.findOne({ where: { email } });
            
            if (!user) {
                return res.status(401).json({ 
                    errorMessage: "Credenciais inválidas." 
                });
            }

            if (user.banido) {
                return res.status(403).json({ 
                    errorMessage: "Esta conta foi banida. Contacte o administrador para mais informações." 
                });
            }

            const validPassword = await bcrypt.compare(password, user.password);
            
            if (!validPassword) {
                return res.status(401).json({ 
                    errorMessage: "Credenciais inválidas." 
                });
            }

            const token = jwt.sign(
                { id: user.id, tipo: user.tipo },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            const userWithoutPassword = {
                id: user.id,
                username: user.username,
                email: user.email,
                tipo: user.tipo
            };

            return res.status(200).json({
                message: "Login efetuado com sucesso.",
                token,
                user: userWithoutPassword
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                errorMessage: "Ocorreu um erro. Por favor, tente novamente mais tarde." 
            });
        }
    },

    register: async (req, res) => {
        try {
            console.log('Conteúdo de req.body:', req.body);
            const { username, email, password, tipo } = req.body;

            if (!username || !email || !password || !tipo) {
                return res.status(400).json({ 
                    errorMessage: "Por favor, preencha todos os campos obrigatórios." 
                });
            }

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ 
                    errorMessage: "Este email já está registado." 
                });
            }

            const existingUsername = await User.findOne({ where: { username } });
            if (existingUsername) {
                return res.status(400).json({ 
                    errorMessage: "Este nome de utilizador já está em uso." 
                });
            }

            const tiposValidos = ['estudante', 'proprietario', 'organizador', 'admin'];
            if (!tiposValidos.includes(tipo)) {
                return res.status(400).json({ 
                    errorMessage: "Tipo de utilizador inválido. Os tipos permitidos são: estudante, proprietario, organizador, admin." 
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                username,
                email,
                password: hashedPassword,
                tipo
            });

            const userWithoutPassword = {
                id: user.id,
                username: user.username,
                email: user.email,
                tipo: user.tipo
            };

            return res.status(201).json({
                message: "Utilizador registado com sucesso.",
                user: userWithoutPassword
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                errorMessage: "Ocorreu um erro. Por favor, tente novamente mais tarde." 
            });
        }
    },

    getMe: async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            
            if (!user) {
                return res.status(404).json({ errorMessage: "User Not Found." });
            }

            const links = [
                { rel: "login", href: "/users/login", method: "POST" },
                { rel: "register", href: "/users", method: "POST" }
            ];

            return res.status(200).json({
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    address: user.address,
                    profileImg: user.profileImg,
                    tipo: user.tipo,
                    isBanned: user.isBanned
                },
                links
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ errorMessage: "Something went wrong. Please try again later." });
        }
    },

    updateMe: async (req, res) => {
        try {
            const { username, email, password, address, profileImg } = req.body;
            const userId = req.user.id;

            if (!username && !email && !password && !address && !profileImg) {
                return res.status(400).json({ errorMessage: "Please provide valid values to update." });
            }

            await User.update(userId, { username, email, password, address, profileImg });
            return res.status(200).json({ message: "Dados atualizados com sucesso." });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ errorMessage: "Something went wrong. Please try again later." });
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const { role, isBanned, limit = 5, page = 0 } = req.query;
            
            if (limit <= 0) {
                return res.status(400).json({ errorMessage: "Limit must be a positive number, higher than 0" });
            }

            if (page < 0) {
                return res.status(400).json({ errorMessage: "Page must be 0 or a positive number" });
            }

            const filters = {};
            if (role) filters.role = role;
            if (isBanned !== undefined) filters.isBanned = isBanned === 'true';
            
            const users = await User.getAll(parseInt(limit), parseInt(page), filters);
            const totalUsers = await User.count(filters);

            if (totalUsers === 0) {
                 return res.status(404).json({ errorMessage: "No users found matching the criteria" });
            }

            const links = [
                { rel: "login", href: "/users/login", method: "POST" },
                { rel: "register", href: "/users", method: "POST" },
                { rel: "editProfile", href: "/users/me", method: "PATCH" },
                { rel: "banUser", href: "/users/:userID", method: "PATCH" }
            ];

            return res.status(200).json({
                pagination: {
                    totalItems: totalUsers,
                    totalPages: Math.ceil(totalUsers / limit),
                    currentPage: parseInt(page),
                    limit: parseInt(limit)
                },
                data: users,
                links
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ errorMessage: "Something went wrong. Please try again later." });
        }
    },

    banUser: async (req, res) => {
        try {
            const { userID } = req.params;
            const { isBanned } = req.body;

            if (req.user.tipo !== 'admin') {
                 return res.status(403).json({ errorMessage: "This action requires administrator privileges." });
            }

            if (typeof isBanned !== 'boolean') {
                return res.status(400).json({ errorMessage: "Please provide a valid isBanned value (true or false)." });
            }

            const user = await User.findById(userID);
            if (!user) {
                return res.status(404).json({ errorMessage: "User not found." });
            }

            if (user.id === req.user.id) {
                 return res.status(400).json({ errorMessage: "You cannot ban or unban yourself." });
            }

            await User.update(userID, { isBanned });
            
            const action = isBanned ? "banned" : "unbanned";
            return res.status(200).json({ message: `User ${action} successfully.` });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ errorMessage: "Something went wrong. Please try again later." });
        }
    }
};

module.exports = userController; 