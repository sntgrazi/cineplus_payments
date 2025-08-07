const jwt = require('jsonwebtoken');
const { User } = require('../models/index');
const bcrypt = require('bcryptjs');

// Gerar token JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar dados
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário
    const user = await User.findOne({ 
      where: { email, isActive: true },
      attributes: ['id', 'name', 'email', 'password', 'role', 'isActive']
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos'
      });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos'
      });
    }

    // Gerar token
    const token = generateToken(user.id);

    // Remover senha da resposta
    const userData = user.toJSON();

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user: userData,
        token
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Registrar novo usuário
const register = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    // Validar dados
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nome, email e senha são obrigatórios'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'A senha deve ter pelo menos 6 caracteres'
      });
    }

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email já está em uso'
      });
    }

    // Criar usuário
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    // Gerar token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: {
        user: user.toJSON(),
        token
      }
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Verificar token
const verifyToken = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        user: user.toJSON()
      }
    });

  } catch (error) {
    console.error('Erro na verificação do token:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  login,
  register,
  verifyToken
};
