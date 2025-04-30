const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "Please fill all the required fields." });
            }

            const user = await User.findByEmail(email);
            
            if (!user) {
                return res.status(404).json({ message: "The user with the provided credentials was not found." });
            }

            if (user.isBanned) {
                return res.status(403).json({ errorMessage: "You are currently banned. You can not access this feature…" });
            }

            const passwordIsValid = await User.verifyPassword(password, user.password);
            
            if (!passwordIsValid) {
                return res.status(401).json({ errorMessage: "Invalid credentials" });
            }

            const token = User.generateToken(user);
            return res.status(200).json({ accessToken: token });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ errorMessage: "Something went wrong. Please try again later" });
        }
    },

    register: async (req, res) => {
        try {
            const { username, email, password, tipo = 'user', address, profileImg } = req.body;

            if (!username || !email || !password) {
                return res.status(400).json({ message: "Please fill all the required fields." });
            }

            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({ message: "User already exists" });
            }

            const userId = await User.create({ username, email, password, tipo, address, profileImg });
            const user = await User.findById(userId);
            const token = User.generateToken(user);

            return res.status(201).json({ 
                message: "Registered Successfully", 
                accessToken: token 
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Something went wrong. Please try again later" });
        }
    },

    getMe: async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            
            if (!user) {
                return res.status(404).json({ message: "User Not Found" });
            }

            const links = [
                { rel: "login", href: "/users/login", method: "POST" },
                { rel: "register", href: "/users", method: "POST" }
            ];

            return res.status(200).json({
                user: {
                    username: user.username,
                    email: user.email,
                    address: user.address,
                    profileImg: user.profileImg,
                    tipo: user.tipo
                },
                links
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Something went wrong. Please try again later" });
        }
    },

    updateMe: async (req, res) => {
        try {
            const { username, email, password, address, profileImg } = req.body;
            const userId = req.user.id;

            if (!username && !email && !password && !address && !profileImg) {
                return res.status(400).json({ message: "Please insert valid values" });
            }

            await User.update(userId, { username, email, password, address, profileImg });
            return res.status(200).json({ message: "Data successfully updated" });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Something went wrong. Please try again later" });
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
            return res.status(500).json({ message: "Something went wrong. Please try again later" });
        }
    },

    banUser: async (req, res) => {
        try {
            const { userID } = req.params;
            const { isBanned } = req.body;

            if (typeof isBanned !== 'boolean') {
                return res.status(400).json({ errorMessage: "Please provide a valid isBanned value (true or false)." });
            }

            const user = await User.findById(userID);
            if (!user) {
                return res.status(404).json({ errorMessage: "Utilizador not found." });
            }

            await User.update(userID, { isBanned });
            return res.status(200).json({ message: "Utilizador atualizado com sucesso." });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ errorMessage: "Something went wrong. Please try again later." });
        }
    }
};

module.exports = userController; 