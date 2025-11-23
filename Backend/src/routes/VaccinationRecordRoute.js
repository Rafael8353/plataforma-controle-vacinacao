const express = require('express');
const router = express.Router();

const VaccinationRecordRepository = require('../repositories/VaccinationRecordRepository');
const VaccinationRecordService = require('../services/VaccinationRecordService');
const VaccinationRecordController = require('../controllers/VaccinationRecordController');

const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorizationMiddleware');

const vaccinationRecordRepo = new VaccinationRecordRepository();
const vaccinationRecordService = new VaccinationRecordService(vaccinationRecordRepo);
const vaccinationRecordController = new VaccinationRecordController(vaccinationRecordService);

// --- Rotas do Paciente ---

router.get('/my-history', 
    authMiddleware,           
    authorize(['patient']),    
    vaccinationRecordController.getMyHistory // (OK se for arrow function no controller)
);

router.get('/certificate',
    authMiddleware,
    authorize(['patient']),
    (req, res) => vaccinationRecordController.getCertificate(req, res)
);

router.get('/vaccines/upcoming',
    authMiddleware,           
    authorize(['patient']),  
    (req, res) => vaccinationRecordController.getUpcoming(req, res) 
);

// --- Rotas do Profissional de Saúde ---

router.get('/professional/stats',
    authMiddleware,
    authorize(['health_professional']),
    (req, res) => vaccinationRecordController.getProfessionalStats(req, res)
);


// POST /vaccination-records (Aplicação de Vacina)
router.post('/', 
    authMiddleware,
    authorize(['health_professional']), // Apenas profissionais podem aplicar
    (req, res) => vaccinationRecordController.create(req, res)
);

module.exports = router;