const express = require('express');
const planRoutes = require('./plans');
const paymentRoutes = require('./payments');
const authRoutes = require('./auth');

const router = express.Router();

// Definir rotas
router.use('/auth', authRoutes);
router.use('/plans', planRoutes);
router.use('/payments', paymentRoutes);

// Rota de teste
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando corretamente',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
