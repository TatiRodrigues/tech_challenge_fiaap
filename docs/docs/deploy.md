---
sidebar_position: 5
title: Deploy
description: Deploy em Vercel, Docker e ambientes cloud
---

# 🚀 Deploy

## Vercel (Recomendado para Frontend)

A Vercel é a plataforma recomendada pela integração nativa com Next.js.

### Passos

1. Acesse [vercel.com](https://vercel.com) e importe o repositório GitHub
2. Configure as variáveis de ambiente (ver abaixo)
3. A Vercel detecta automaticamente Next.js e configura o build

### Variáveis de Ambiente (Vercel)

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `NEXT_PUBLIC_API_URL` | URL do BFF | Ex: `https://seu-bff.railway.app` |
| `NEXT_PUBLIC_MFE_TRANSACTIONS_URL` | URL MFE Transactions | `https://transactions.vercel.app` |
| `NEXT_PUBLIC_MFE_AUTH_URL` | URL MFE Auth | `https://auth.vercel.app` |

### Headers de Segurança

O arquivo `vercel.json` já configura os headers de segurança:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```

---

## Docker (Desenvolvimento / Staging)

### Estrutura de pastas

```
/dev/
├── tech_challenge_fiaap/   ← frontend
└── tech-challenge-2/       ← BFF
```

### Iniciar todos os serviços

```bash
cd tech_challenge_fiaap
docker compose up -d mongo bff
npm run dev
```

### Serviços no docker-compose.yml

| Serviço | Imagem | Porta | Descrição |
|---------|--------|-------|-----------|
| `mongo` | `mongo:7` | 27017 | Banco de dados |
| `bff` | Build local | 3000 | Backend for Frontend |
| `app` | `node:20-slim` | 3001 | Frontend Next.js |

:::info Nota Alpine/SWC
O Dockerfile.dev usa `node:20-slim` (Debian/glibc). Versões anteriores com `node:20-alpine` falhavam porque os binários SWC nativos do Next.js requerem glibc.

**Em Windows:** por limitação dos volume mounts (sobrescrevem `node_modules`), o frontend deve rodar no host com `npm run dev`.
:::

### Verificar logs

```bash
docker compose ps
docker compose logs bff --tail 30
docker compose logs mongo --tail 10
```

### Parar tudo

```bash
docker compose down
```

---

## AWS / Azure / Railway (BFF)

O BFF pode ser hospedado em qualquer plataforma que suporte Node.js e MongoDB:

- **Railway** — deploy simples via GitHub, inclui MongoDB como add-on
- **Render** — gratuito para serviços pequenos
- **AWS ECS / Azure Container Apps** — para produção enterprise

Após o deploy do BFF, atualize `NEXT_PUBLIC_API_URL` no Vercel.

---

[← API e Serviços](./api-servicos) | [Microfrontends →](./microfrontends)
