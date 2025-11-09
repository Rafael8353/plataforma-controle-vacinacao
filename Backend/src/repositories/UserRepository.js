const { User } = require('../models');
const { Sequelize } = require('sequelize');

class UserRepository {
    /**
     * @param userData 
     * @returns 
     */
    async createUser(userData) {
        try {
            const newUser = await User.create(userData);
            return newUser;
        } catch (error) {
            if (error instanceof Sequelize.UniqueConstraintError) 
                throw new Error(`Um dos campos únicos (E-mail, CPF ou Cartão SUS) já está em uso.`);

            if (error instanceof Sequelize.ValidationError) 
                throw new Error(error.errors[0].message);

            if (error.message.includes('O registro profissional é obrigatório') || error.message.includes('O número do cartão do SUS é obrigatório')) 
                throw new Error(error.message);

            throw new Error('Ocorreu um erro ao registrar o usuário no banco de dados.');
        }
    }

    /** 
     * @param email
     * @returns {Promise<User|null>} 
     */
    async findByEmail(email) {
        return await User.findOne({ where: { email } });
    }

    /**
     * @param cpf
     * @returns {Promise<User|null>} 
     */
    async findByCpf(cpf) {
        return await User.findOne({ where: { cpf } });
    }

    /**
     * Busca o usuario pelo id
     * @param id
     * @returns {Promise<User|null>}
     */
    async findById(id) {
        return await User.findByPk(id);
    }
     
}

module.exports = UserRepository;