const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorizationMiddleware');

const VaccineLotRepository = require('../repositories/VaccineLotRepository');
const VaccineLotService = require('../services/VaccineLotService');
const VaccineLotController = require('../controllers/VaccineLotController');

const vaccineLotRepository = new VaccineLotRepository();
const vaccineLotService = new VaccineLotService(vaccineLotRepository);
const vaccineLotController = new VaccineLotController(vaccineLotService);

router.use(authMiddleware);
router.use(authorize(['health_professional'])); // apenas profissionais de saúde podem gerenciar lotes 

router.post('/create', vaccineLotController.create);
router.get('/list', vaccineLotController.list);
router.get('/list/:id', vaccineLotController.getById);
router.put('/update/:id', vaccineLotController.update);
router.delete('/delete/:id', vaccineLotController.delete);

module.exports = router;