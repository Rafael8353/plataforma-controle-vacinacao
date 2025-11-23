const UserRepository = require('../repositories/UserRepository');

class UserController {
    // Ajustei para aceitar injeção de dependência, mantendo consistência com os outros controllers
    constructor(userService) {
        // Se passar userService, usa ele. Se não, cria um repositório novo.
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

            // Limpa o CPF
            const cleanCpf = cpf.replace(/\D/g, '');

            const user = await this.userRepository.findByCpf(cleanCpf);

            if (!user) {
                return res.status(404).json({ error: 'Paciente não encontrado.' });
            }

            // ▼▼▼ SEGURANÇA: Remove a senha aqui também ▼▼▼
            const userJson = user.toJSON();
            delete userJson.password_hash;

            // Retorna em um array (padrão REST para buscas)
            return res.status(200).json([userJson]);

        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar usuário.' });
        }
    }
}

module.exports = UserController;