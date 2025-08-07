const express = require('express');
const PlanController = require('../controllers/PlanController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Rotas públicas (visualização de planos)
router.get('/', PlanController.getAll);
router.get('/:id', PlanController.getById);

// Rotas administrativas (criar/editar planos) - requer admin
router.post('/', authenticateToken, requireAdmin, PlanController.create);
router.put('/:id', authenticateToken, requireAdmin, PlanController.update);
router.delete('/:id', authenticateToken, requireAdmin, PlanController.delete);

module.exports = router;
