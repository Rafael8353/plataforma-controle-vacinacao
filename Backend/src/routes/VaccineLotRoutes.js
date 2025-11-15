// src/routes/VaccineLotRoutes.js
const express = require('express');
const router = express.Router();

// 1. Importar Middlewares de Segurança
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorizationMiddleware');

// 2. Importar Dependências do CRUD
const VaccineLotRepository = require('../repositories/VaccineLotRepository');
const VaccineLotService = require('../services/VaccineLotService');
const VaccineLotController = require('../controllers/VaccineLotController');

// 3. Injetar Dependências
const vaccineLotRepository = new VaccineLotRepository();
const vaccineLotService = new VaccineLotService(vaccineLotRepository);
const vaccineLotController = new VaccineLotController(vaccineLotService);

// ===================================================================
// APLICAÇÃO DOS CRITÉRIOS DE ACEITAÇÃO DE SEGURANÇA
// ===================================================================

// 4. Aplicar Autenticação (Verifica Token) em TODAS as rotas de /lotes
//    Qualquer requisição a /lotes (POST, GET, PUT, DELETE) passará por aqui.
router.use(authMiddleware);

// 5. Aplicar Autorização (Verifica Perfil) em TODAS as rotas de /lotes
//    Permite acesso APENAS a 'profissional_de_saude' (ou o nome do perfil no seu BD).
router.use(authorize(['profissional_de_saude'])); 

// ===================================================================
// DEFINIÇÃO DAS ROTAS DO CRUD
// ===================================================================

// POST /lotes (Criar Lote)
router.post('/', vaccineLotController.create);

// GET /lotes (Listar Lotes, com filtros)
router.get('/', vaccineLotController.list);

// GET /lotes/:id (Buscar Lote Específico)
router.get('/:id', vaccineLotController.getById);

// PUT /lotes/:id (Atualizar Lote)
router.put('/:id', vaccineLotController.update);

// DELETE /lotes/:id (Desativar Lote - Soft Delete)
router.delete('/:id', vaccineLotController.delete);


module.exports = router;