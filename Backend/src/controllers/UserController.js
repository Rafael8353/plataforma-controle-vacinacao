const UserRepository = require('../repositories/UserRepository');

class UserController {
    constructor() {
        this.userRepository = new UserRepository();
    }

    /**
     * Retorna os dados do usuário logado
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    async getMe(req, res) {
        try {
            const userId = req.user.id;
            const user = await this.userRepository.findById(userId);

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            // Retorna apenas dados seguros 
            const userJson = user.toJSON();
            delete userJson.password_hash;

            return res.status(200).json(userJson);
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
            return res.status(500).json({ error: 'Erro interno ao processar solicitação.' });
        }
    }
}

module.exports = new UserController();

