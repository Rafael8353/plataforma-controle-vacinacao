class VaccinationRecordController {
    constructor(vaccinationRecordService) {
        this.vaccinationRecordService = vaccinationRecordService;
    }

    getMyHistory = async (req, res) => {
        try {
            // Assume-se que um middleware de auth populou req.user
            const patientId = req.user.id; 
            
            // opcional so para preservar a logca
            if (req.user.role !== 'patient') {
                return res.status(403).json({ error: 'Acesso negado. Apenas pacientes podem visualizar seu histórico.' });
            }

            const history = await this.vaccinationRecordService.getPatientHistory(patientId);

            return res.status(200).json(history);

        } catch (error) {
            console.error('Erro ao buscar histórico de vacinação:', error);
            return res.status(500).json({ error: 'Erro interno ao processar solicitação.' });
        }
    }
}

module.exports = VaccinationRecordController;