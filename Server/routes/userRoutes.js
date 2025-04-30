const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, isAdmin } = require('../middleware/auth');

// Rotas públicas
router.post('/login', userController.login);
router.post('/', userController.register);

// Rotas protegidas
router.get('/me', auth, userController.getMe);
router.patch('/me', auth, userController.updateMe);
router.get('/', auth, isAdmin, userController.getAllUsers);
router.patch('/:userID', auth, isAdmin, userController.banUser);

module.exports = router; 