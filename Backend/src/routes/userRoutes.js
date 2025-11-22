const express = require('express');
const router = express.Router();

const UserRepository = require('../repositories/UserRepository');
const UserService = require('../services/UserService');

const RegisterController = require('../controllers/RegisterController');
const LoginController = require('../controllers/LoginController');
const UserController = require('../controllers/UserController');

const authMiddleware = require('../middlewares/authMiddleware');

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

const registerController = new RegisterController(userService);
const loginController = new LoginController(userService);

router.post('/register', (req, res) => registerController.handleRegister(req, res));
router.post('/login', (req, res) => loginController.handleLogin(req, res));
router.get('/me', authMiddleware, (req, res) => UserController.getMe(req, res));

module.exports = router;