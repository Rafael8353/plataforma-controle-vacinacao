const jwt = require('jsonwebtoken');
require('dotenv').config();

class JwtService {
    constructor() {
        this.secret = process.env.JWT_SECRET;
        
        if (!this.secret) {
            throw new Error('JWT_SECRET não está definido nas variáveis de ambiente.'); // 
        }
    }

    /**
     * Gera um token JWT para o usuário fornecido
     * @param payload 
     * @param expiresIn
     * @returns {string}
     **/
    generateToken(payload, expiresIn = '1d') {
        return jwt.sign(payload, this.secret, { expiresIn });
    }

    /**
     * Veriffica o token
     * @param token
     * @returns {object} 
     */
    verifyToken(token) {
        try {
            return jwt.verify(token, this.secret);
        }catch (error) {
            throw new Error('Token inválido ou expirado.', error.message);
        }
    }
}

module.exports = new JwtService();