const { Plan } = require('../models/index');
const Joi = require('joi');

// Schema de validação
const planSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().allow('', null),
  price: Joi.number().positive().required(),
  currency: Joi.string().length(3).default('BRL'),
  duration_months: Joi.number().integer().positive().default(1),
  features: Joi.array().items(Joi.string()),
  is_active: Joi.boolean().default(true),
  display_order: Joi.number().integer().default(0)
});

class PlanController {
  // Listar todos os planos ativos
  static async getAll(req, res) {
    try {
      const plans = await Plan.findAll({
        where: { is_active: true },
        order: [['display_order', 'ASC'], ['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: plans,
        total: plans.length
      });
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar planos'
      });
    }
  }

  // Buscar plano por ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      
      const plan = await Plan.findByPk(id);
      
      if (!plan) {
        return res.status(404).json({
          success: false,
          message: 'Plano não encontrado'
        });
      }

      res.json({
        success: true,
        data: plan
      });
    } catch (error) {
      console.error('Erro ao buscar plano:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar plano'
      });
    }
  }

  // Criar novo plano
  static async create(req, res) {
    try {
      const { error, value } = planSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.details.map(detail => detail.message)
        });
      }

      const plan = await Plan.create(value);

      res.status(201).json({
        success: true,
        message: 'Plano criado com sucesso',
        data: plan
      });
    } catch (error) {
      console.error('Erro ao criar plano:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao criar plano'
      });
    }
  }

  // Atualizar plano
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = planSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.details.map(detail => detail.message)
        });
      }

      const [affectedRows] = await Plan.update(value, {
        where: { id }
      });

      if (affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Plano não encontrado'
        });
      }

      const updatedPlan = await Plan.findByPk(id);

      res.json({
        success: true,
        message: 'Plano atualizado com sucesso',
        data: updatedPlan
      });
    } catch (error) {
      console.error('Erro ao atualizar plano:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar plano'
      });
    }
  }

  // Deletar plano (soft delete)
  static async delete(req, res) {
    try {
      const { id } = req.params;

      const [affectedRows] = await Plan.update(
        { is_active: false },
        { where: { id } }
      );

      if (affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Plano não encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Plano removido com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover plano:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao remover plano'
      });
    }
  }
}

module.exports = PlanController;
