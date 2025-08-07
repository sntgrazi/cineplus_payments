# Guia de Execução - Sistema de Pagamento

## Pré-requisitos

- Docker e Docker Compose instalados
- Git (opcional, para versionamento)

## Como executar o projeto

### 1. Configurar variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Configure as credenciais do Mercado Pago nos arquivos:
# - backend/.env
# - frontend/.env

# Edite com suas credenciais do Mercado Pago
# Obtenha as credenciais em: https://www.mercadopago.com.br/developers
```

### 2. Executar com Docker

```bash
# Parar containers existentes (se houver)
docker-compose down

# Remover containers antigos (opcional, para rebuild completo)
docker-compose down --volumes --remove-orphans

# Subir todos os serviços
docker-compose up -d --build

# Acompanhar logs (opcional)
docker-compose logs -f
```

### 3. Acessar a aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **phpMyAdmin**: http://localhost:8080
  - Servidor: mysql
  - Usuário: admin
  - Senha: admin123

## Comandos úteis

### Parar os serviços
```bash
docker-compose down
```

### Recriar containers (após mudanças)
```bash
docker-compose down
docker-compose up -d --build
```

### Ver logs de um serviço específico
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Acessar shell de um container
```bash
docker-compose exec backend bash
docker-compose exec frontend sh
```

### Backup do banco de dados
```bash
docker-compose exec mysql mysqldump -u admin -padmin123 pagamento_db > backup.sql
```

### Restaurar backup
```bash
docker-compose exec -i mysql mysql -u admin -padmin123 pagamento_db < backup.sql
```

## Desenvolvimento

### Estrutura de pastas
```
projeto-pagamento/
├── backend/          # API Node.js + Express
├── frontend/         # App Vue.js
├── database/         # Scripts SQL
├── docker-compose.yml
└── README.md
```

### Endpoints da API

#### Planos
- `GET /api/plans` - Listar planos
- `GET /api/plans/:id` - Buscar plano
- `POST /api/plans` - Criar plano
- `PUT /api/plans/:id` - Atualizar plano
- `DELETE /api/plans/:id` - Remover plano

#### Pagamentos
- `POST /api/payments/create-preference` - Criar preferência de pagamento
- `GET /api/payments/:id/status` - Status do pagamento
- `POST /api/payments/webhook` - Webhook do Mercado Pago
- `GET /api/payments` - Listar pagamentos

### Configuração do Mercado Pago

Veja o arquivo `MERCADO_PAGO_SETUP.md` para instruções detalhadas.

## Troubleshooting

### Erro "Cannot find module" no backend
```bash
# Parar todos os containers
docker-compose down

# Reconstruir apenas o backend
docker-compose build --no-cache backend

# Subir novamente
docker-compose up -d
```

### Erro de conexão com banco
```bash
# Verificar se o MySQL está rodando
docker-compose ps

# Reiniciar serviços
docker-compose restart mysql backend
```

### Frontend não carrega
```bash
# Verificar logs do frontend
docker-compose logs frontend

# Reconstruir o container
docker-compose up -d --build frontend
```

### Rebuild completo (resolver a maioria dos problemas)
```bash
# Parar tudo e limpar
docker-compose down --volumes --remove-orphans
docker system prune -f

# Rebuild completo
docker-compose up -d --build
```

### Problemas com permissões (Linux/Mac)
```bash
# Dar permissão para o Docker
sudo usermod -aG docker $USER
# Reiniciar a sessão

# Ou rodar com sudo
sudo docker-compose up -d
```

## Suporte

Para dúvidas ou problemas:
1. Verifique os logs dos containers
2. Consulte a documentação do Mercado Pago
3. Verifique se todas as variáveis de ambiente estão configuradas
