const { Vaccine } = require('../models'); 
const { Op } = require('sequelize'); 

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

        const vaccineExists = await Vaccine.findByPk(vacina_id);
        if (!vaccineExists) {
            throw new Error('Vacina (vacina_id) não encontrada.');
        }

        const dataToCreate = {
            vaccine_id: vacina_id, // Chave estrangeira
            lot_number: numero_lote,
            expiry_date: data_validade,
            quantity_initial: quantidade_doses_inicial,
            quantity_current: quantidade_doses_inicial // Regra de negócio
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
            throw new Error('Lote não encontrado.');
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

        const options = {
            include: [{ model: Vaccine, as: 'vaccine' }], 
            where: {}
        };

        // Aplica filtro: ?vacina_id={id}
        if (vacina_id) {
            options.where.vacina_id = vacina_id;
        }

        // Aplica filtro: ?disponivel=true
        if (disponivel === 'true') {
           options.where.expiry_date = { [Op.gt]: new Date() }; // Antes estava 'data_validade'
            options.where.quantity_current = { [Op.gt]: 0 };
        }

        return await this.vaccineLotRepository.findAll(options);
    }

    /**
     * Atualiza um lote (apenas numero_lote e data_validade).
     * @param {number} id - O ID do lote.
     * @param {object} updateData - Dados para atualizar.
     * @returns {Promise<VaccineLot>}
     */
    async updateLot(id, updateData) {
        await this.getLotById(id);

        // Regra de Negócio: Apenas 'numero_lote' e 'data_validade' podem ser atualizados.
        const dataToUpdate = {
            lot_number: updateData.numero_lote,
            expiry_date: updateData.data_validade
        };

        // Remove campos que não foram enviados (para não tentar atualizar com "undefined")
        Object.keys(dataToUpdate).forEach(key => 
            dataToUpdate[key] === undefined && delete dataToUpdate[key]
        );

        Object.keys(dataToUpdate).forEach(key => 
            dataToUpdate[key] === undefined && delete dataToUpdate[key]
        );

        await this.vaccineLotRepository.update(id, dataToUpdate);
        
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