const express = require('express');
const { Customer, Payment, Plan } = require('../models/index');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Middleware para proteger todas as rotas admin
router.use(authenticateToken);
router.use(requireAdmin);

// Listar todos os clientes com informações de pagamentos
router.get('/customers', async (req, res) => {
  try {
    const { page = 1, limit = 50, search = '' } = req.query;
    const offset = (page - 1) * limit;

    const whereConditions = {};
    if (search) {
      whereConditions[Op.or] = [
        { full_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } }
      ];
    }

    const customers = await Customer.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Payment,
          as: 'payments',
          include: [
            {
              model: Plan,
              as: 'plan',
              attributes: ['name', 'price']
            }
          ],
          order: [['created_at', 'DESC']]
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Adicionar estatísticas de pagamento para cada cliente
    const customersWithStats = customers.rows.map(customer => {
      const customerData = customer.toJSON();
      const payments = customerData.payments || [];
      
      return {
        ...customerData,
        payment_count: payments.length,
        last_payment: payments.length > 0 ? payments[0].created_at : null,
        total_spent: payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0)
      };
    });

    res.json({
      success: true,
      data: customersWithStats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: customers.count,
        totalPages: Math.ceil(customers.count / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Obter detalhes de um cliente específico
router.get('/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id, {
      include: [
        {
          model: Payment,
          as: 'payments',
          include: [
            {
              model: Plan,
              as: 'plan'
            }
          ],
          order: [['created_at', 'DESC']]
        }
      ]
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
    }

    const customerData = customer.toJSON();
    const payments = customerData.payments || [];

    const customerWithStats = {
      ...customerData,
      payment_count: payments.length,
      total_spent: payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0),
      last_payment: payments.length > 0 ? payments[0].created_at : null
    };

    res.json({
      success: true,
      data: customerWithStats
    });
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Estatísticas gerais para dashboard
router.get('/stats', async (req, res) => {
  try {
    const [
      totalCustomers,
      totalPayments,
      totalRevenue,
      recentPayments
    ] = await Promise.all([
      Customer.count(),
      Payment.count(),
      Payment.sum('amount'),
      Payment.findAll({
        include: [
          {
            model: Customer,
            as: 'customer',
            attributes: ['full_name', 'email']
          },
          {
            model: Plan,
            as: 'plan',
            attributes: ['name']
          }
        ],
        order: [['created_at', 'DESC']],
        limit: 10
      })
    ]);

    res.json({
      success: true,
      data: {
        totalCustomers,
        totalPayments,
        totalRevenue: totalRevenue || 0,
        recentPayments
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
