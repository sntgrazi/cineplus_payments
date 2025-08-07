const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  full_name: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 150]
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  cpf: {
    type: DataTypes.STRING(14),
    allowNull: true,
    validate: {
      is: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
    }
  },
  birth_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  address: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Endereço completo do cliente'
  }
}, {
  tableName: 'customers',
  indexes: [
    {
      unique: true,
      fields: ['email']
    },
    {
      fields: ['cpf']
    }
  ]
});

  return Customer;
};
