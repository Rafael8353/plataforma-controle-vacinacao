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
    
   // aqui pode ter outros met
    // async login(email, password) { ... }
}

module.exports = UserService;