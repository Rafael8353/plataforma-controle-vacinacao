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

    /**
     * Obtem as próximas vacinas de acordo com o histórico do paciente.
     * @param {String} patientId 
     * @returns {Promise<Array>} 
     */
    async getUpcomingVaccines(patientId) {
        const history = await this.vaccinationRecordRepository.findByPatientId(patientId);
        
        const upcomingList = [];
        const processedVaccines = new Set(); 

        const today = new Date();
        today.setHours(0, 0, 0, 0); 

        for (const record of history) {
            const vaccine = record.vaccineLot.vaccine;
            const vaccineId = vaccine.id;

            if (processedVaccines.has(vaccineId)) {
                continue;
            }

            processedVaccines.add(vaccineId);

            if (vaccine.dose_interval_days && vaccine.dose_interval_days > 0) {
                
                const lastDoseDate = new Date(record.application_date);
                
                const nextDoseDate = new Date(lastDoseDate);
                nextDoseDate.setDate(lastDoseDate.getDate() + vaccine.dose_interval_days);
                
                nextDoseDate.setHours(0, 0, 0, 0);

                if (nextDoseDate >= today) {
                    upcomingList.push({
                        vaccine_name: vaccine.name,
                        next_dose_date: nextDoseDate.toISOString().split('T')[0], // Retorna YYYY-MM-DD
                        dose_info: `Próxima dose sequencial (baseado no intervalo de ${vaccine.dose_interval_days} dias)`,
                        manufacturer: vaccine.manufacturer
                    });
                }
            }
        }

        return upcomingList;
    }
}

module.exports = VaccinationRecordService;