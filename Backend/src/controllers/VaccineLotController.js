// src/controllers/VaccineLotController.js

/**
 * Controller para lidar com as requisições HTTP para Lotes de Vacinas.
 */
class VaccineLotController {
    /**
     * @param {import('../services/VaccineLotService')} vaccineLotService
     */
    constructor(vaccineLotService) {
        this.vaccineLotService = vaccineLotService;

        // Garante que o 'this' está correto dentro dos métodos
        this.create = this.create.bind(this);
        this.list = this.list.bind(this);
        this.getById = this.getById.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    /**
     * Lida com a criação de um novo lote (POST /lotes)
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async create(req, res) {
        try {
            // Os dados vêm do corpo da requisição
            const lotData = req.body;
            
            // Validação básica de entrada
            const { vacina_id, numero_lote, data_validade, quantidade_doses_inicial } = lotData;
            if (!vacina_id || !numero_lote || !data_validade || quantidade_doses_inicial === undefined) {
                return res.status(400).json({ error: 'Campos obrigatórios ausentes: vacina_id, numero_lote, data_validade, quantidade_doses_inicial.' });
            }

            const newLot = await this.vaccineLotService.createLot(lotData);
            
            // Sucesso: 201 Created
            return res.status(201).json(newLot);
        } catch (error) {
            // Trata erros conhecidos (ex: Vacina não encontrada)
            if (error.message.includes('Vacina (vacina_id) não encontrada')) {
                return res.status(400).json({ error: error.message });
            }
            // Outros erros
            return res.status(500).json({ error: 'Erro ao criar o lote.', details: error.message });
        }
    }

    /**
     * Lida com a listagem de lotes (GET /lotes)
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async list(req, res) {
        try {
            // Os filtros vêm da query string (req.query)
            const filters = req.query; // ex: { disponivel: 'true', vacina_id: '1' }
            
            const lots = await this.vaccineLotService.listLots(filters);
            
            // Sucesso: 200 OK
            return res.status(200).json(lots);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar os lotes.', details: error.message });
        }
    }

    /**
     * Lida com a busca de um lote específico (GET /lotes/:id)
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async getById(req, res) {
        try {
            const { id } = req.params;
            const lot = await this.vaccineLotService.getLotById(id);
            
            // Sucesso: 200 OK
            return res.status(200).json(lot);
        } catch (error) {
            // Erro específico do Service (Lote não encontrado)
            if (error.message === 'Lote não encontrado.') {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Erro ao buscar o lote.', details: error.message });
        }
    }

    /**
     * Lida com a atualização de um lote (PUT /lotes/:id)
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async update(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            // Validação (não permitir atualizar campos proibidos)
            if (updateData.quantidade_doses_inicial !== undefined || updateData.quantidade_doses_atual !== undefined) {
                return res.status(400).json({ error: 'Não é permitido atualizar as quantidades de doses por este endpoint.' });
            }

            const updatedLot = await this.vaccineLotService.updateLot(id, updateData);
            
            // Sucesso: 200 OK
            return res.status(200).json(updatedLot);
        } catch (error) {
            // Erro específico do Service (Lote não encontrado)
            if (error.message === 'Lote não encontrado.') {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Erro ao atualizar o lote.', details: error.message });
        }
    }

    /**
     * Lida com a desativação (soft delete) de um lote (DELETE /lotes/:id)
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async delete(req, res) {
        try {
            const { id } = req.params;
            await this.vaccineLotService.deleteLot(id);
            
            // Sucesso: 204 No Content (resposta padrão para DELETE)
            return res.status(204).send();
        } catch (error) {
            // Erro específico do Service (Lote não encontrado)
            if (error.message === 'Lote não encontrado.') {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Erro ao deletar o lote.', details: error.message });
        }
    }
}

module.exports = VaccineLotController;