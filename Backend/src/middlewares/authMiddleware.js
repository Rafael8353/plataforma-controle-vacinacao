// src/middlewares/authMiddleware.js
const JwtService = require('../services/JwtService');
const UserRepository = require('../repositories/UserRepository');

/**
 * Middleware para verificar a autenticação JWT
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
    }

    // O formato do token é "Bearer <token>"
    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ error: 'Token mal formatado.' });
    }

    const token = parts[1];

    try {
        // 1. Verifica se o token é válido e decodifica o payload
        const payload = JwtService.verifyToken(token);

        // 2. Anexa o payload (que contém userId e role) ao objeto req
        req.user = {
            id: payload.userId,
            role: payload.role
        };

        // 3. Opcional mas recomendado: Verificar se o usuário ainda existe no banco
        //    Isso previne que tokens de usuários deletados continuem válidos.
        const userRepository = new UserRepository(); // Cuidado com a injeção aqui
        const userExists = await userRepository.findById(payload.userId);
        
        if (!userExists) {
            return res.status(401).json({ error: 'Usuário do token não encontrado.' });
        }

        // Tudo certo, pode seguir para a próxima rota/middleware
        return next();
    } catch (_error) {
        return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
}

module.exports = authMiddleware;