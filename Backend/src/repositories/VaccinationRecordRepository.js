const { VaccinationRecord, VaccineLot, Vaccine, User } = require('../models');
const { Op } = require('sequelize');

class VaccinationRecordRepository {
    
    async findByPatientId(patientId) {
        return await VaccinationRecord.findAll({
            where: { patient_id: patientId },
            attributes: ['application_date', 'location', 'notes'], // Adicione 'dose_number' se tiver no banco
            include: [
                {
                    model: User,
                    as: 'professional',
                    attributes: ['name', 'professional_register'] 
                },
                {
                    model: VaccineLot,
                    as: 'vaccineLot',

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

    async findByProfessionalId(professionalId) {
        return await VaccinationRecord.findAll({
            where: { professional_id: professionalId },
            attributes: ['id', 'application_date', 'patient_id']
        });
    }

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

    async countUniquePatientsByProfessional(professionalId) {
        const { Sequelize } = require('sequelize');
        const result = await VaccinationRecord.findAll({
            where: { professional_id: professionalId },
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('patient_id')), 'patient_id']
            ],
            raw: true
        });
        return result.filter(r => r.patient_id !== null).length;
    }

    async create(data) {
        return await VaccinationRecord.create(data);
    }
}

module.exports = VaccinationRecordRepository;