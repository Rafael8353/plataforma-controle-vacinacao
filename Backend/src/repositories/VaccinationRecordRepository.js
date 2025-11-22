const { VaccinationRecord, VaccineLot, Vaccine, User } = require('../models');
const { Op } = require('sequelize');

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
            attributes: ['application_date', 'location', 'notes'], 
            include: [
                {
                    model: User,
                    as: 'professional',
                    attributes: ['name', 'professional_register'] 
                },
                {
                    model: VaccineLot,
                    as: 'vaccineLot',
                    attributes: ['lot_number', 'expiry_date'],
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

    /**
     * Busca registros de vacinação por profissional
     * @param {string} professionalId - UUID do profissional
     * @returns {Promise<VaccinationRecord[]>}
     */
    async findByProfessionalId(professionalId) {
        return await VaccinationRecord.findAll({
            where: { professional_id: professionalId },
            attributes: ['id', 'application_date', 'patient_id']
        });
    }

    /**
     * Conta registros de vacinação de um profissional em uma data específica
     * @param {string} professionalId - UUID do profissional
     * @param {Date} date - Data para filtrar
     * @returns {Promise<number>}
     */
    async countByProfessionalAndDate(professionalId, date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        return await VaccinationRecord.count({
            where: {
                professional_id: professionalId,
                application_date: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            }
        });
    }

    /**
     * Conta pacientes únicos atendidos por um profissional
     * @param {string} professionalId - UUID do profissional
     * @returns {Promise<number>}
     */
    async countUniquePatientsByProfessional(professionalId) {
        const { Sequelize } = require('sequelize');
        const result = await VaccinationRecord.findAll({
            where: { professional_id: professionalId },
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('patient_id')), 'patient_id']
            ],
            raw: true
        });
        // Filtrar resultados nulos e contar
        return result.filter(r => r.patient_id !== null).length;
    }
}

module.exports = VaccinationRecordRepository;