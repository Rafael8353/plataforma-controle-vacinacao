const UserRepository = require('../repositories/UserRepository');

class UserController {
    constructor(userService) {
        this.userRepository = userService ? userService.userRepository : new UserRepository();
    }

    /**
     * Retorna os dados do usuário logado
     */
    async getMe(req, res) {
        try {
            const userId = req.user.id;
            const user = await this.userRepository.findById(userId);

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            // Segurança: Remove a senha antes de enviar
            const userJson = user.toJSON();
            delete userJson.password_hash;

            return res.status(200).json(userJson);
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
            return res.status(500).json({ error: 'Erro interno ao processar solicitação.' });
        }
    }

    /**
     * Busca usuário por CPF
     */
    async search(req, res) {
        try {
            const { cpf } = req.query;

            if (!cpf) {
                return res.status(400).json({ error: 'CPF é obrigatório para busca.' });
            }

            const cleanCpf = cpf.replace(/\D/g, '');

            const user = await this.userRepository.findByCpf(cleanCpf);

            if (!user) {
                return res.status(404).json({ error: 'Paciente não encontrado.' });
            }

            const userJson = user.toJSON();
            delete userJson.password_hash;

            return res.status(200).json([userJson]);

        } catch (error) {
            console.error('Erro ao buscar usuário por CPF:', error);
            return res.status(500).json({ error: 'Erro ao buscar usuário.' });
        }
    }

    // busca o user por email
    
}

module.exports = UserController;