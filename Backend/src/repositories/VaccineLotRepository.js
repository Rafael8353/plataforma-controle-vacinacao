// src/repositories/VaccineLotRepository.js
const { VaccineLot, Vaccine } = require('../models');

/**
 * Repositório para operações de Lote de Vacina no banco de dados.
 */
class VaccineLotRepository {

    /**
     * Cria um novo lote de vacina no banco de dados.
     * @param {object} data - Dados do lote a ser criado.
     * @returns {Promise<VaccineLot>} O lote criado.
     */
    async create(data) {
        return await VaccineLot.create(data);
    }

    /**
     * Busca um lote por ID, incluindo a vacina associada.
     * @param {number} id - O ID do lote.
     * @returns {Promise<VaccineLot|null>} O lote encontrado ou nulo.
     */
    async findById(id) {
        return await VaccineLot.findByPk(id, {
            include: [{ model: Vaccine, as: 'vaccine' }]
        });
    }

    /**
     * Busca todos os lotes com base em opções de filtro e inclusão.
     * Assume que o model VaccineLot está com 'paranoid: true' (soft delete).
     * @param {object} options - Opções de busca do Sequelize (where, include, etc.).
     * @returns {Promise<VaccineLot[]>} Uma lista de lotes.
     */
    async findAll(options) {
        return await VaccineLot.findAll(options);
    }

    /**
     * Atualiza um lote de vacina no banco de dados.
     * @param {number} id - O ID do lote a ser atualizado.
     * @param {object} data - Dados a serem atualizados.
     * @returns {Promise<[number, VaccineLot[]]>} Retorna o número de linhas afetadas e os dados atualizados.
     */
    async update(id, data) {
        return await VaccineLot.update(data, {
            where: { id },
            returning: true // Importante para retornar o objeto atualizado no Postgres
        });
    }

    /**
     * Executa um soft delete em um lote (define 'deleted_at').
     * @param {number} id - O ID do lote a ser deletado.
     * @returns {Promise<number>} O número de linhas deletadas.
     */
    async softDelete(id) {
        // O .destroy() com 'paranoid: true' no model executa o soft delete
        return await VaccineLot.destroy({
            where: { id }
        });
    }
}

module.exports = VaccineLotRepository;