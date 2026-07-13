FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm config set fetch-timeout 520000 && npm config set fetch-retry-mintimeout 60000 && npm config set fetch-retry-maxtimeout 120000 && npm ci

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY package*.json ./

RUN npm config set fetch-timeout 520000 && npm config set fetch-retry-mintimeout 60000 && npm config set fetch-retry-maxtimeout 120000 && npm ci --omit=dev && npm cache clean --force

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Mudar para usuário não-root
USER nextjs

EXPOSE 3000

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["npm", "start"]
