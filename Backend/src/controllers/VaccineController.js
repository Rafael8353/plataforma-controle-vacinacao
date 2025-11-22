const VaccineRepository = require('../repositories/VaccineRepository');
const VaccineService = require('../services/VaccineService');

const vaccineRepository = new VaccineRepository();
const vaccineService = new VaccineService(vaccineRepository);

class VaccineController {
    
    async create(req, res) {
        try {
            const vaccine = await vaccineService.createVaccine(req.body);
            return res.status(201).json(vaccine);
        } catch (error) {
            // Erros de validação do Sequelize (campos vazios, tipos errados)
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({ error: error.message });
            }
            return res.status(400).json({ error: error.message });
        }
    }

    async index(req, res) {
        try {
            const vaccines = await vaccineService.listVaccines();
            return res.json(vaccines);
        } catch (error) {
            console.error(error); // Log do erro para debug
            return res.status(500).json({ error: 'Erro ao listar vacinas.' });
        }
    }

    async show(req, res) {
        try {
            const { id } = req.params;
            const vaccine = await vaccineService.getVaccineById(id);
            return res.json(vaccine);
        } catch (error) {
            if (error.message === 'Vacina não encontrada.') {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const vaccine = await vaccineService.updateVaccine(id, req.body);
            return res.json(vaccine);
        } catch (error) {
            if (error.message === 'Vacina não encontrada.') {
                return res.status(404).json({ error: error.message });
            }
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({ error: error.message });
            }
            return res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            await vaccineService.deleteVaccine(id);
            return res.status(204).send(); // 204 No Content
        } catch (error) {
            if (error.message === 'Vacina não encontrada.') {
                return res.status(404).json({ error: error.message });
            }
            if (error.message.includes('Não é possível excluir')) {
                return res.status(400).json({ error: error.message }); // ou 409 Conflict
            }
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new VaccineController();