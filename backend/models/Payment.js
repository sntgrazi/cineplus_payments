const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'plans',
        key: 'id'
      }
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'BRL'
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'approved',
        'authorized',
        'in_process',
        'in_mediation',
        'rejected',
        'cancelled',
        'refunded',
        'charged_back'
      ),
      allowNull: false,
      defaultValue: 'pending'
    },
    mp_payment_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'ID do pagamento no Mercado Pago'
    },
    mp_preference_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'ID da preferência no Mercado Pago'
    },
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    payment_response: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Resposta completa do Mercado Pago'
    },
    processed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'payments',
    indexes: [
      {
        fields: ['status']
      },
      {
        fields: ['mp_payment_id']
      },
      {
        fields: ['mp_preference_id']
      },
      {
        fields: ['plan_id']
      },
      {
        fields: ['customer_id']
      }
    ]
  });

  return Payment;
};
