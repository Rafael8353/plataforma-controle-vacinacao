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
        const payload = JwtService.verifyToken(token);

        req.user = {
            id: payload.userId,
            role: payload.role
        };

        // 3. Verifica se o usuário ainda existe no banco
        //    Isso previne que tokens de usuários deletados continuem válidos.
        const userRepository = new UserRepository(); 
        const userExists = await userRepository.findById(payload.userId);
        
        if (!userExists) {
            return res.status(401).json({ error: 'Usuário do token não encontrado.' });
        }

        return next();
    } catch {
        return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
}

module.exports = authMiddleware;