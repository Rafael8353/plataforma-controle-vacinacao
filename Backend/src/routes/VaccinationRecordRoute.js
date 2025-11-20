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

router.get('/vaccination-records/my-history', 
    authMiddleware,           // Verifica Token e popula req.user
    authorize(['patient']),     // Verifica se req.user.role === 'patient'
    vaccinationRecordController.getMyHistory
);

router.get('/vaccines/upcoming',
    authMiddleware,           
    authorize(['patient']),  
    (req, res) => vaccinationRecordController.getUpcoming(req, res) 
);

module.exports = router;