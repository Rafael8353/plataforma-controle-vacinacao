class VaccinationRecordService {
    /**
     * @param {import('../repositories/VaccinationRecordRepository')} vaccinationRecordRepository
     */
    constructor(vaccinationRecordRepository) {
        this.vaccinationRecordRepository = vaccinationRecordRepository;
    }

    /**
     * Obtém o histórico formatado para o paciente logado.
     * @param {string} patientId 
     * @returns {Promise<Array>} 
     */
    async getPatientHistory(patientId) {
        const rawRecords = await this.vaccinationRecordRepository.findByPatientId(patientId);

        const formattedHistory = rawRecords.map(record => {
            // Validação defensiva para evitar crash se alguma relação estiver faltando (dados inconsistentes)
            const lot = record.vaccineLot || {};
            const vaccine = lot.vaccine || {};
            const professional = record.professional || {};

            return {
                application_date: record.application_date,
                location: record.location || 'Não informado',
                vaccine_name: vaccine.name,
                vaccine_manufacturer: vaccine.manufacturer,
                dose_info: vaccine.dose_info,
                lot_number: lot.lot_number, 
                professional_name: professional.name,
                professional_register: professional.professional_register
            };
        });

        return formattedHistory;
    }
}

module.exports = VaccinationRecordService;