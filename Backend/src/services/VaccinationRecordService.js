const UserRepository = require('../repositories/UserRepository'); 
const VaccineLotRepository = require('../repositories/VaccineLotRepository');

class VaccinationRecordService {
    /**
     * @param {import('../repositories/VaccinationRecordRepository')} vaccinationRecordRepository
     */
    constructor(vaccinationRecordRepository) {
        this.vaccinationRecordRepository = vaccinationRecordRepository;
        this.userRepository = new UserRepository(); 
        this.vaccineLotRepository = new VaccineLotRepository();
    }

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
                // Garante pegar numero_lote (PT) ou lot_number (EN)
                lot_number: lot.numero_lote || lot.lot_number, 
                professional_name: professional.name,
                professional_register: professional.professional_register
            };
        });

        return formattedHistory;
    }

    async getUpcomingVaccines(patientId) {
        // (O código que você mandou estava correto, mantive igual)
        const history = await this.vaccinationRecordRepository.findByPatientId(patientId);
        const upcomingList = [];
        const processedVaccines = new Set(); 
        const today = new Date();
        today.setHours(0, 0, 0, 0); 

        for (const record of history) {
            const vaccine = record.vaccineLot ? record.vaccineLot.vaccine : null;
            if (!vaccine) continue; // Proteção contra dados nulos

            const vaccineId = vaccine.id;
            if (processedVaccines.has(vaccineId)) continue;
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

    async generateCertificate(patientId) {
        const patient = await this.userRepository.findById(patientId);

        if (!patient) throw new Error('Paciente não encontrado.');
        
        // Validação de CPF e SUS
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
                        number: lot.numero_lote || lot.lot_number || 'N/A',
                        // ▼▼▼ CORREÇÃO CRÍTICA: Pegar data_validade ou expiry_date ▼▼▼
                        expiration_date: lot.data_validade || lot.expiry_date || 'N/A'
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

    // ... (Métodos getProfessionalStats e applyVaccine mantidos iguais, pois estavam corretos)
    async getProfessionalStats(professionalId) {
       // ... (código anterior)
       const today = new Date();
       today.setHours(0, 0, 0, 0);
       const aplicacoesHoje = await this.vaccinationRecordRepository.countByProfessionalAndDate(professionalId, today);
       const totalPacientes = await this.vaccinationRecordRepository.countUniquePatientsByProfessional(professionalId);
       return { atendimentosHoje: aplicacoesHoje, totalPacientes, aplicacoesHoje };
    }

    async applyVaccine(data) {
        const { patient_id, vaccine_lot_id, professional_id, application_date } = data;

        const lot = await this.vaccineLotRepository.findById(vaccine_lot_id);
        if (!lot) throw new Error('Lote de vacina não encontrado.');

        // Usa quantidade_doses_atual (padrão PT)
        if (lot.quantidade_doses_atual <= 0) {
            throw new Error('Este lote não possui doses disponíveis (Estoque zerado).');
        }

        // Usa data_validade (padrão PT)
        if (new Date(lot.data_validade) < new Date()) {
            throw new Error('Não é possível aplicar: Este lote está vencido.');
        }

        await this.vaccineLotRepository.update(lot.id, {
            quantidade_doses_atual: lot.quantidade_doses_atual - 1
        });

        const newRecord = await this.vaccinationRecordRepository.create({
            patient_id,
            professional_id,
            vaccine_lot_id,
            application_date: application_date || new Date(),
            dose_number: 'Única',
            location: 'Unidade de Saúde',
            notes: 'Aplicação registrada via sistema'
        });

        return newRecord;
    }
}

module.exports = VaccinationRecordService;