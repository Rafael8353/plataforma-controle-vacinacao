class VaccineService {
    constructor(vaccineRepository) {
        this.vaccineRepository = vaccineRepository;
    }

    async createVaccine(data) {
        return await this.vaccineRepository.create(data);
    }

    async listVaccines() {
        return await this.vaccineRepository.findAll();
    }

    async getVaccineById(id) {
        const vaccine = await this.vaccineRepository.findById(id);
        if (!vaccine) {
            throw new Error('Vacina não encontrada.');
        }
        return vaccine;
    }

    async updateVaccine(id, data) {
        const existingVaccine = await this.vaccineRepository.findById(id);
        if (!existingVaccine) {
            throw new Error('Vacina não encontrada.');
        }

        return await this.vaccineRepository.update(id, data);
    }

    async deleteVaccine(id) {
        const existingVaccine = await this.vaccineRepository.findById(id);
        if (!existingVaccine) {
            throw new Error('Vacina não encontrada.');
        }

        // REGRA DE NEGÓCIO: Não permitir exclusão se houver lotes associados
        const associatedLotsCount = await this.vaccineRepository.countLots(id);
        
        if (associatedLotsCount > 0) {
            throw new Error('Não é possível excluir. Vacina já possui lotes cadastrados.');
        }

        return await this.vaccineRepository.delete(id);
    }
}

module.exports = VaccineService;