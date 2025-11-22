// src/services/VaccinationRecordService.js
const UserRepository = require('../repositories/UserRepository'); 

class VaccinationRecordService {
    /**
     * @param {import('../repositories/VaccinationRecordRepository')} vaccinationRecordRepository
     */
    constructor(vaccinationRecordRepository) {
        this.vaccinationRecordRepository = vaccinationRecordRepository;
        this.userRepository = new UserRepository(); 
    }

    /**
     * Obtém o histórico formatado para o paciente logado.
     * @param {string} patientId 
     * @returns {Promise<Array>} 
     */
    async getPatientHistory(patientId) {
        const rawRecords = await this.vaccinationRecordRepository.findByPatientId(patientId);

        const formattedHistory = rawRecords.map(record => {
            const lot = record.vaccineLot || {};
            const vaccine = lot.vaccine || {};
            const professional = record.professional || {};

            return {
                application_date: record.application_date,
                location: record.location || 'Não informado',
                vaccine_name: vaccine.name,
                vaccine_manufacturer: vaccine.manufacturer,
                dose_info: vaccine.dose_info,
                lot_number: lot.numero_lote || lot.lot_number, 
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
                        next_dose_date: nextDoseDate.toISOString().split('T')[0],
                        dose_info: `Próxima dose sequencial (baseado no intervalo de ${vaccine.dose_interval_days} dias)`,
                        manufacturer: vaccine.manufacturer
                    });
                }
            }
        }

        return upcomingList;
    }

    /**
     * Gera o comprovante de vacinação completo (Certificado).
     * @param {string} patientId 
     * @returns {Promise<Object>}
     */
    async generateCertificate(patientId) {
        const patient = await this.userRepository.findById(patientId);

        if (!patient) {
            throw new Error('Paciente não encontrado.');
        }

        if (!patient.cpf || !patient.sus_card_number) {
            throw new Error('Cadastro incompleto: Para gerar o certificado, é necessário ter CPF e Cartão do SUS cadastrados.');
        }

        const records = await this.vaccinationRecordRepository.findByPatientId(patientId);

        const certificate = {
            user_info: {
                full_name: patient.name,
                cpf: patient.cpf,
                birth_date: patient.birth_date,
                sus_card_number: patient.sus_card_number
            },
            vaccinations: records.map(record => {
                const lot = record.vaccineLot || {};
                const vaccine = lot.vaccine || {};
                const professional = record.professional || {};

                return {
                    vaccine_name: vaccine.name || 'Vacina não identificada',
                    manufacturer: vaccine.manufacturer || 'N/A',
                    application_date: record.application_date,
                    dose: record.dose_number || 'Única',
                    lot: {
                        number: lot.lot_number || 'N/A',
                        expiration_date: lot.expiry_date || 'N/A'
                    },
                    applicator: {
                        name: professional.name || 'N/A',
                        register: professional.professional_register || 'N/A'
                    }
                };
            }),
            issued_at: new Date()
        };

        return certificate;
    }

    /**
     * Obtém estatísticas do profissional de saúde
     * @param {string} professionalId 
     * @returns {Promise<Object>}
     */
    async getProfessionalStats(professionalId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Aplicações hoje
        const aplicacoesHoje = await this.vaccinationRecordRepository.countByProfessionalAndDate(
            professionalId, 
            today
        );

        // Total de pacientes únicos
        const totalPacientes = await this.vaccinationRecordRepository.countUniquePatientsByProfessional(
            professionalId
        );

        // Atendimentos hoje (mesmo que aplicações hoje, já que cada aplicação é um atendimento)
        const atendimentosHoje = aplicacoesHoje;

        return {
            atendimentosHoje,
            totalPacientes,
            aplicacoesHoje
        };
    }
}

module.exports = VaccinationRecordService;