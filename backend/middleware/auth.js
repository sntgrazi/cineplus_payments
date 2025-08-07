const jwt = require('jsonwebtoken');
const { User } = require('../models/index');

// Middleware para verificar autenticação
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acesso requerido'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuário
    const user = await User.findByPk(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    // Adicionar dados do usuário à requisição
    req.userId = user.id;
    req.user = user;
    next();

  } catch (error) {
    console.error('Erro na autenticação:', error);
    return res.status(403).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

// Middleware para verificar se é admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Permissões de administrador requeridas.'
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin
};
