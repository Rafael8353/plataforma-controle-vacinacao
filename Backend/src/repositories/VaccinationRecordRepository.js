const { VaccinationRecord, VaccineLot, Vaccine, User } = require('../models');

class VaccinationRecordRepository {
    
    /**
     * Busca o histórico de vacinação de um paciente específico.
     * Realiza os joins (includes) necessários para trazer dados do lote, vacina e profissional.
     * @param {string} patientId - UUID do paciente.
     * @returns {Promise<VaccinationRecord[]>}
     */
    async findByPatientId(patientId) {
        return await VaccinationRecord.findAll({
            where: { patient_id: patientId },
            attributes: ['application_date', 'location', 'notes', 'dose_number'], 
            include: [
                {
                    model: User,
                    as: 'professional',
                    attributes: ['name', 'professional_register'] 
                },
                {
                    model: VaccineLot,
                    as: 'vaccineLot',
                    attributes: ['lot_number', 'numero_lote', 'data_validade'],
                    include: [
                        {
                            model: Vaccine,
                            as: 'vaccine',
                            attributes: ['name', 'manufacturer', 'dose_info', 'dose_interval_days']
                        }
                    ]
                }
            ],
            order: [['application_date', 'DESC']]
        });
    }
}

module.exports = VaccinationRecordRepository;