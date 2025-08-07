-- Inicialização do banco de dados e permissões
-- Garantir que o usuário admin tenha privilégios adequados
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%' WITH GRANT OPTION;
GRANT CREATE, DROP ON *.* TO 'admin'@'%';
FLUSH PRIVILEGES;

USE cineplus_payments;

-- Criar tabela de planos primeiro
CREATE TABLE IF NOT EXISTS plans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  duration_months INT DEFAULT 1,
  features JSON,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_active (is_active),
  INDEX idx_display_order (display_order)
);

-- Criar tabela de usuários para login e administração
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Criar tabela de clientes
CREATE TABLE IF NOT EXISTS customers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE,
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_cpf (cpf)
);

-- Criar tabela de pagamentos
CREATE TABLE IF NOT EXISTS payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  plan_id INT NOT NULL,
  customer_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  status ENUM('pending', 'approved', 'rejected', 'cancelled', 'refunded') DEFAULT 'pending',
  payment_method VARCHAR(50),
  external_payment_id VARCHAR(255),
  external_reference VARCHAR(255),
  payment_date DATETIME,
  expires_at DATETIME,
  notification_url TEXT,
  success_url TEXT,
  failure_url TEXT,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_status (status),
  INDEX idx_plan_id (plan_id),
  INDEX idx_customer_id (customer_id),
  INDEX idx_external_payment_id (external_payment_id),
  
  FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Inserir usuário administrador padrão (senha: admin123)
INSERT INTO users (name, email, password, role, is_active) VALUES
('Administrador CinePlus', 'admin@cineplus.com', '$2a$10$dTHiKNYVr1x1Ifz32On2bOGtxffSD37jtwOQ4BNUfU3RS9NQq64dy', 'admin', true);

-- Inserir planos de exemplo para CinePlus
INSERT INTO plans (name, description, price, currency, duration_months, features, is_active, display_order, created_at, updated_at) VALUES
('CinePlus Básico', 'Plano básico com acesso a filmes essenciais', 19.90, 'BRL', 1, 
 JSON_ARRAY('Catálogo básico', 'Qualidade HD', '1 tela simultânea', 'Suporte por email'), 
 true, 1, NOW(), NOW()),

('CinePlus Premium', 'Plano premium com recursos avançados', 39.90, 'BRL', 1, 
 JSON_ARRAY('Catálogo completo', 'Qualidade 4K', '4 telas simultâneas', 'Downloads offline', 'Sem anúncios', 'Suporte prioritário'), 
 true, 2, NOW(), NOW()),

('CinePlus Família', 'Ideal para toda a família', 59.90, 'BRL', 1, 
 JSON_ARRAY('Catálogo completo', 'Qualidade 4K', '6 telas simultâneas', 'Downloads offline', 'Sem anúncios', 'Controle parental', 'Perfis personalizados'), 
 true, 3, NOW(), NOW()),

('CinePlus Anual', 'Plano anual com desconto especial', 399.90, 'BRL', 12, 
 JSON_ARRAY('Catálogo completo', 'Qualidade 4K', '4 telas simultâneas', 'Downloads offline', 'Sem anúncios', '3 meses grátis', 'Estreias exclusivas'), 
 true, 4, NOW(), NOW());

-- Inserir um cliente de exemplo para testes
INSERT INTO customers (full_name, email, phone, cpf, created_at, updated_at) VALUES
('João Silva', 'joao.silva@exemplo.com', '11999999999', '123.456.789-00', NOW(), NOW());

-- Inserir um pagamento de exemplo
INSERT INTO payments (plan_id, customer_id, amount, currency, status, created_at, updated_at) VALUES
(1, 1, 29.90, 'BRL', 'pending', NOW(), NOW());
