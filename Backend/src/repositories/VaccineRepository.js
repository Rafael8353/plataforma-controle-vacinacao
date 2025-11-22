const { Vaccine, VaccineLot } = require('../models');

class VaccineRepository {
    
    async create(data) {
        return await Vaccine.create(data);
    }

    async findAll() {
        return await Vaccine.findAll();
    }

    async findById(id) {
        return await Vaccine.findByPk(id);
    }

    async update(id, data) {
        // O update do Sequelize retorna [numeroDeLinhasAfetadas]
        const [affectedRows] = await Vaccine.update(data, {
            where: { id }
        });
        
        // Se atualizou, retornamos a vacina atualizada
        if (affectedRows > 0) {
            return await this.findById(id);
        }
        return null;
    }

    async delete(id) {
        return await Vaccine.destroy({
            where: { id }
        });
    }

    /**
     * Verifica quantos lotes estão associados a esta vacina.
     * Útil para a regra de negócio de impedimento de exclusão.
     */
    async countLots(vaccineId) {
        return await VaccineLot.count({
            where: { vaccine_id: vaccineId }
        });
    }
}

module.exports = VaccineRepository;