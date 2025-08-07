const mercadopago = require('mercadopago');
const { v4: uuidv4 } = require('uuid');
const { Plan, Customer, Payment } = require('../models/index');
const Joi = require('joi');

// Configurar Mercado Pago
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

// Schema de validação para checkout
const checkoutSchema = Joi.object({
  plan_id: Joi.number().integer().required(),
  customer: Joi.object({
    full_name: Joi.string().min(2).max(150).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    cpf: Joi.string().pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/).optional(),
    birth_date: Joi.date().optional(),
    address: Joi.object({
      street: Joi.string().optional(),
      number: Joi.string().optional(),
      neighborhood: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      zip_code: Joi.string().optional()
    }).optional()
  }).required()
});

class PaymentController {
  // Criar preferência de pagamento
  static async createPreference(req, res) {
    try {
      const { error, value } = checkoutSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.details.map(detail => detail.message)
        });
      }

      const { plan_id, customer: customerData } = value;

      // Buscar o plano
      const plan = await Plan.findByPk(plan_id);
      if (!plan || !plan.is_active) {
        return res.status(404).json({
          success: false,
          message: 'Plano não encontrado ou inativo'
        });
      }

      // Criar ou buscar cliente
      let customer = await Customer.findOne({
        where: { email: customerData.email }
      });

      if (!customer) {
        customer = await Customer.create(customerData);
      } else {
        await customer.update(customerData);
      }

      // Criar registro de pagamento
      const payment = await Payment.create({
        plan_id: plan.id,
        customer_id: customer.id,
        amount: plan.price,
        currency: plan.currency,
        status: 'pending'
      });

      // Criar preferência no Mercado Pago
      const preference = {
        items: [
          {
            id: plan.id.toString(),
            title: plan.name,
            description: plan.description || `Plano ${plan.name}`,
            quantity: 1,
            currency_id: plan.currency,
            unit_price: parseFloat(plan.price)
          }
        ],
        payer: {
          name: customer.full_name,
          email: customer.email,
          phone: {
            number: customer.phone
          }
        },
        back_urls: {
          success: `${process.env.FRONTEND_URL}/pagamento/sucesso`,
          failure: `${process.env.FRONTEND_URL}/pagamento/erro`,
          pending: `${process.env.FRONTEND_URL}/pagamento/pendente`
        },
        auto_return: 'approved',
        external_reference: payment.id.toString(),
        notification_url: `${process.env.API_URL || 'http://localhost:5000'}/api/payments/webhook`,
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
      };

      const response = await mercadopago.preferences.create(preference);

      // Atualizar pagamento com preference_id
      await payment.update({
        mp_preference_id: response.body.id,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });

      res.json({
        success: true,
        data: {
          preference_id: response.body.id,
          init_point: response.body.init_point,
          sandbox_init_point: response.body.sandbox_init_point,
          payment_id: payment.id
        }
      });

    } catch (error) {
      console.error('Erro ao criar preferência:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao processar pagamento'
      });
    }
  }

  // Webhook do Mercado Pago
  static async webhook(req, res) {
    try {
      const { type, data } = req.body;

      if (type === 'payment') {
        const paymentInfo = await mercadopago.payment.findById(data.id);
        const payment = await Payment.findOne({
          where: { mp_preference_id: paymentInfo.body.collector_id }
        });

        if (payment) {
          await payment.update({
            mp_payment_id: paymentInfo.body.id,
            status: paymentInfo.body.status,
            payment_method: paymentInfo.body.payment_method_id,
            payment_response: paymentInfo.body,
            processed_at: new Date()
          });
        }
      }

      res.status(200).send('OK');
    } catch (error) {
      console.error('Erro no webhook:', error);
      res.status(500).send('ERROR');
    }
  }

  // Verificar status do pagamento
  static async getPaymentStatus(req, res) {
    try {
      const { id } = req.params;

      const payment = await Payment.findByPk(id, {
        include: [
          { model: Plan, as: 'plan' },
          { model: Customer, as: 'customer' }
        ]
      });

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Pagamento não encontrado'
        });
      }

      res.json({
        success: true,
        data: payment
      });
    } catch (error) {
      console.error('Erro ao buscar status do pagamento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar status do pagamento'
      });
    }
  }

  // Listar pagamentos
  static async getAll(req, res) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = status ? { status } : {};

      const { count, rows: payments } = await Payment.findAndCountAll({
        where: whereClause,
        include: [
          { model: Plan, as: 'plan' },
          { model: Customer, as: 'customer' }
        ],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        success: true,
        data: payments,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar pagamentos'
      });
    }
  }
}

module.exports = PaymentController;
