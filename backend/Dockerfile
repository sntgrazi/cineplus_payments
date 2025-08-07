FROM node:18-alpine

# Instalar dependências do sistema
RUN apk add --no-cache bash

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Mudar propriedade dos arquivos
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 5000

# Comando para iniciar a aplicação em modo desenvolvimento
CMD ["npm", "run", "dev"]
