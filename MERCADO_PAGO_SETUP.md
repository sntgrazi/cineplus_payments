# Configuração do Mercado Pago

## 1. Criar conta no Mercado Pago

1. Acesse https://www.mercadopago.com.br/developers
2. Faça login ou crie uma conta
3. Crie uma aplicação

## 2. Obter credenciais

Após criar a aplicação, você terá acesso a:

- **Public Key**: Usada no frontend para integrar o Mercado Pago
- **Access Token**: Usada no backend para criar preferências de pagamento

### Ambiente de Teste (Sandbox)
- Use as credenciais de teste para desenvolvimento
- Não processa pagamentos reais

### Ambiente de Produção
- Use as credenciais de produção apenas quando estiver pronto
- Processa pagamentos reais

## 3. Configurar no projeto

### Backend (.env)
```
MP_ACCESS_TOKEN=APP_USR-XXXXXXXXXXXXXXXX
MP_PUBLIC_KEY=APP_USR-XXXXXXXXXXXXXXXX
```

### Frontend (.env)
```
VITE_MP_PUBLIC_KEY=APP_USR-XXXXXXXXXXXXXXXX
```

## 4. Webhook de notificações

Configure o webhook no painel do Mercado Pago:
- URL: `https://seudominio.com/api/payments/webhook`
- Eventos: payment

## 5. URLs de retorno

Configure no código (já está configurado automaticamente):
- Sucesso: `/pagamento/sucesso`
- Erro: `/pagamento/erro`
- Pendente: `/pagamento/pendente`

## Documentação oficial
- https://www.mercadopago.com.br/developers/pt/docs
