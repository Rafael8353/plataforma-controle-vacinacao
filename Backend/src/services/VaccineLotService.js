// src/services/VaccineLotService.js
const { Vaccine, VaccineLot } = require('../models'); // Importamos o Vaccine também
const { Op } = require('sequelize'); // Para filtros avançados (>, <, etc.)

/**
 * Serviço para a lógica de negócio de Lotes de Vacinas.
 */
class VaccineLotService {
    /**
     * @param {import('../repositories/VaccineLotRepository')} vaccineLotRepository
     */
    constructor(vaccineLotRepository) {
        this.vaccineLotRepository = vaccineLotRepository;
    }

    /**
     * Cria um novo lote de vacina.
     * @param {object} lotData - Dados do lote.
     * @returns {Promise<VaccineLot>}
     */
    async createLot(lotData) {
        const { vacina_id, numero_lote, data_validade, quantidade_doses_inicial } = lotData;

        // Validação 1: Verificar se a vacina (vacina_id) existe
        // (Isso pressupõe que seu model 'Vaccine' está disponível)
        const vaccineExists = await Vaccine.findByPk(vacina_id);
        if (!vaccineExists) {
            throw new Error('Vacina (vacina_id) não encontrada.');
        }

        // Validação 2: Regra de Negócio (Critério de Aceitação)
        const dataToCreate = {
            vacina_id,
            numero_lote,
            data_validade,
            quantidade_doses_inicial,
            quantidade_doses_atual: quantidade_doses_inicial // Regra de negócio
        };

        return await this.vaccineLotRepository.create(dataToCreate);
    }

    /**
     * Busca um lote específico por ID.
     * @param {number} id - O ID do lote.
     * @returns {Promise<VaccineLot>}
     */
    async getLotById(id) {
        const lot = await this.vaccineLotRepository.findById(id);
        if (!lot) {
            throw new Error('Lote não encontrado.'); // Será pego pelo Controller (404)
        }
        return lot;
    }

    /**
     * Lista todos os lotes com base em filtros.
     * @param {object} filters - Objeto de filtros (disponivel, vacina_id)
     * @returns {Promise<VaccineLot[]>}
     */
    async listLots(filters) {
        const { disponivel, vacina_id } = filters;

        // Opções de busca base
        const options = {
            include: [{ model: Vaccine, as: 'vaccine' }], // Inclui a vacina associada
            where: {}
        };

        // Aplica filtro: ?vacina_id={id}
        if (vacina_id) {
            options.where.vacina_id = vacina_id;
        }

        // Aplica filtro: ?disponivel=true
        if (disponivel === 'true') {
            options.where.data_validade = { [Op.gt]: new Date() }; // Validade futura
            options.where.quantidade_doses_atual = { [Op.gt]: 0 }; // Doses > 0
        }

        // O 'paranoid: true' (soft delete) no model já garante que
        // lotes deletados (DELETE /lotes/:id) não apareçam aqui.

        return await this.vaccineLotRepository.findAll(options);
    }

    /**
     * Atualiza um lote (apenas numero_lote e data_validade).
     * @param {number} id - O ID do lote.
     * @param {object} updateData - Dados para atualizar.
     * @returns {Promise<VaccineLot>}
     */
    async updateLot(id, updateData) {
        // Garante que o lote existe antes de tentar atualizar
        await this.getLotById(id);

        // Regra de Negócio (Critério de Aceitação):
        // Apenas 'numero_lote' e 'data_validade' podem ser atualizados.
        const dataToUpdate = {
            numero_lote: updateData.numero_lote,
            data_validade: updateData.data_validade
        };

        // Remove campos undefined para não sobrescrever com 'null'
        Object.keys(dataToUpdate).forEach(key => 
            dataToUpdate[key] === undefined && delete dataToUpdate[key]
        );

        await this.vaccineLotRepository.update(id, dataToUpdate);
        
        // Retorna o lote atualizado
        return this.vaccineLotRepository.findById(id);
    }

    /**
     * Desativa (soft delete) um lote.
     * @param {number} id - O ID do lote.
     * @returns {Promise<void>}
     */
    async deleteLot(id) {
        // Garante que o lote existe
        await this.getLotById(id);
        
        await this.vaccineLotRepository.softDelete(id);
    }
}

module.exports = VaccineLotService;