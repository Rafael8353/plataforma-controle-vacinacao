const { Router } = require('express');
const VaccineController = require('../controllers/VaccineController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorizationMiddleware');

const routes = Router();

routes.use('/vaccines', authMiddleware, authorize(['health_professional']));

routes.post('/vaccines', VaccineController.create);
routes.get('/vaccines', VaccineController.index);
routes.get('/vaccines/:id', VaccineController.show);
routes.put('/vaccines/:id', VaccineController.update);
routes.delete('/vaccines/:id', VaccineController.delete);

module.exports = routes;