# Sistema de Pagamento com Planos

Sistema completo para gerenciamento de planos de pagamento com integração ao Mercado Pago.

## Tecnologias Utilizadas

- **Backend**: Node.js + Express
- **Frontend**: Vue.js 3
- **Banco de Dados**: MySQL
- **Containerização**: Docker + Docker Compose
- **Administração DB**: phpMyAdmin
- **Pagamentos**: Mercado Pago API

## Estrutura do Projeto

```
projeto-pagamento/
├── backend/                 # API Node.js
├── frontend/               # Aplicação Vue.js
├── database/              # Scripts SQL
├── docker-compose.yml     # Configuração Docker
└── README.md
```

## Como Executar

1. Clone o projeto
2. Configure as variáveis de ambiente
3. Execute com Docker:

```bash
docker-compose up -d
```

## Acessos

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **phpMyAdmin**: http://localhost:8080
- **MySQL**: localhost:3306

## Funcionalidades

- ✅ Cadastro de planos
- ✅ Listagem de planos
- ✅ Seleção de plano pelo cliente
- ✅ Formulário de dados do cliente
- ✅ Integração com Mercado Pago
- ✅ Processamento de pagamentos
