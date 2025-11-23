class VaccinationRecordController {
    constructor(vaccinationRecordService) {
        this.vaccinationRecordService = vaccinationRecordService;
    }

    getMyHistory = async (req, res) => {
        try {
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

    async getUpcoming(req, res) {
        try {
            const patientId = req.user.id;

            console.log('Patient ID extraído:', patientId); 

            if (!patientId) {
                return res.status(401).json({ error: 'Usuário não identificado corretamente.' });
            }

            const upcomingVaccines = await this.vaccinationRecordService.getUpcomingVaccines(patientId);
            
            return res.status(200).json(upcomingVaccines);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao buscar próximas vacinas.' });
        }
    }

async getCertificate(req, res) {
        try {
            const patientId = req.user.id;

            if (req.user.role !== 'patient') {
                return res.status(403).json({ error: 'Apenas pacientes podem emitir certificados.' });
            }

            const certificate = await this.vaccinationRecordService.generateCertificate(patientId);

            return res.status(200).json(certificate);

        } catch (error) {
            console.error('Erro ao gerar certificado:', error);
            
            // Tratamento específico para a validação de CPF/SUS
            if (error.message.includes('Cadastro incompleto')) {
                return res.status(400).json({ error: error.message });
            }

            return res.status(500).json({ error: 'Erro interno ao gerar o certificado.' });
        }
    }

    /**
     * Retorna estatísticas do profissional de saúde
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    async getProfessionalStats(req, res) {
        try {
            const professionalId = req.user.id;

            if (req.user.role !== 'health_professional') {
                return res.status(403).json({ error: 'Apenas profissionais de saúde podem acessar essas estatísticas.' });
            }

            const stats = await this.vaccinationRecordService.getProfessionalStats(professionalId);
            
            return res.status(200).json(stats);
        } catch (error) {
            console.error('Erro ao buscar estatísticas do profissional:', error);
            return res.status(500).json({ error: 'Erro interno ao processar solicitação.' });
        }
    }

    async create(req, res) {
        try {
            // O ID do profissional vem do token de autenticação
            const professionalId = req.user.id;
            
            // Dados vindos do Frontend
            const { patient_id, vaccine_lot_id } = req.body;

            if (!patient_id || !vaccine_lot_id) {
                return res.status(400).json({ error: 'Dados incompletos (Paciente ou Lote faltando).' });
            }

            const record = await this.vaccinationRecordService.applyVaccine({
                patient_id,
                vaccine_lot_id,
                professional_id: professionalId,
                application_date: new Date()
            });

            return res.status(201).json(record);

        } catch (error) {
            console.error('Erro ao aplicar vacina:', error);
            // Erros de negócio (sem estoque, vencido, etc)
            return res.status(400).json({ error: error.message });
        }
    }
}

module.exports = VaccinationRecordController;