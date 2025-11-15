const bcrypt = require('bcryptjs');
const JwtService = require('../services/JwtService');

class UserService {
    /**
     * Recebe o userRepository por injeção de dependencia
     * @param userRepository
     */
    constructor(userRepository) {
        this.userRepository = userRepository; 
    }

    /**
     * Registra um novo user no sistema
     * 
     * @param userData 
     * @returns token
     */
    async registerUser(userData) {
        const existingEmail = await this.userRepository.findByEmail(userData.email);
        const existingCpf = await this.userRepository.findByCpf(userData.cpf);

        if (existingEmail || existingCpf) {
            throw new Error('E-mail ou CPF já cadastrado.');
        }

        const { password, ...rest } = userData;

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await this.userRepository.createUser({
            ...rest,
            password_hash: passwordHash
        });

        const tokenPayload = {
            userId: newUser.id,
            role: newUser.role
        };

        const token = JwtService.generateToken(tokenPayload, '1d');

        return token;
    }
    
/**
     * Autentica um usuário e retorna um token JWT
     * * @param {string} email 
     * @param {string} password 
     * @returns {string} token
     */
        async login(identifier, password) {
      

        // 1. Tenta encontrar o usuário pelo e-mail
        let user = await this.userRepository.findByEmail(identifier);

        // 2. Se não encontrar por e-mail, tenta encontrar pelo CPF
        if (!user) {
            user = await this.userRepository.findByCpf(identifier);
        }
        
        // 3. Se não encontrou de nenhuma forma, lança o erro
        if (!user) {
            // A mensagem de erro agora é genérica, como pedido
            throw new Error('Credenciais inválidas.');
        }

        // 4. Verificar se a senha está correta
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            throw new Error('Credenciais inválidas.');
        }

        // 5. Gerar o token
        const tokenPayload = {
            userId: user.id,
            role: user.role
        };

        const token = JwtService.generateToken(tokenPayload, '1d');

        return token;
    }
}

module.exports = UserService;