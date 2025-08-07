const express = require('express');
const PaymentController = require('../controllers/PaymentController');

const router = express.Router();

// Criar preferência de pagamento
router.post('/create-preference', PaymentController.createPreference);

// Webhook do Mercado Pago
router.post('/webhook', PaymentController.webhook);

// Verificar status do pagamento
router.get('/:id/status', PaymentController.getPaymentStatus);

// Listar pagamentos (administrativo)
router.get('/', PaymentController.getAll);

module.exports = router;
