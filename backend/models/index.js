const { sequelize } = require('../config/database');

// Importar e inicializar modelos
const Plan = require('./Plan')(sequelize);
const Customer = require('./Customer')(sequelize);
const Payment = require('./Payment')(sequelize);
const User = require('./User')(sequelize);

// Definir relacionamentos
Customer.hasMany(Payment, { foreignKey: 'customer_id', as: 'payments' });
Payment.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

Plan.hasMany(Payment, { foreignKey: 'plan_id', as: 'payments' });
Payment.belongsTo(Plan, { foreignKey: 'plan_id', as: 'plan' });

module.exports = { 
  sequelize, 
  Plan, 
  Customer, 
  Payment, 
  User 
};
