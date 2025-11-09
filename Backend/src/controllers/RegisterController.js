class RegisterController {
    /**
     * Recebe o userService por injeção de dependencia
     * @param userService
     */
    constructor(userService) {
        this.userService = userService;
    }

    async handleRegister(req, res) {
        const {
            nomeCompleto,
            dataNascimento,
            cpf, 
            email,
            password,
            telefone,
            role, // "pacient" ou "health_professional"
            sus_card_number,
            professional_register,
        } = req.body;

        const userData = {
            name: nomeCompleto,
            birth_date: dataNascimento,
            cpf: cpf,
            email: email,
            password: password,
            phone_number: telefone,
            role: role,
            sus_card_number: sus_card_number,
            professional_register: professional_register,
        };

        try {
            const token  = await this.userService.registerUser(userData);

            res.status(201).json({ 
                message: 'Usuário registrado com sucesso.',
                token
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = RegisterController;