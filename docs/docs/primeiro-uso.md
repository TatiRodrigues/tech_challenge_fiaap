---
sidebar_position: 1
title: Primeiro Uso
description: Como executar o projeto localmente
---

# 📚 Primeiro Uso

## Pré-requisitos

| Ferramenta | Versão mínima | Download |
|-----------|--------------|---------|
| **Node.js** | 20 LTS | https://nodejs.org |
| **npm** | 10+ | (incluso no Node.js) |
| **Docker Desktop** | 24+ | https://www.docker.com/products/docker-desktop |

---

## 🖥️ Modo 1 — Somente Frontend (mais rápido)

Use dados locais de exemplo (`public/transactions.json`) sem precisar de backend.

```bash
git clone https://github.com/TatiRodrigues/tech_challenge_fiaap.git
cd tech_challenge_fiaap
npm install
npm run dev
```

Acesse: **http://localhost:3001**

```
Email: teste@gmail.com
Senha: testes
```

---

## 🐳 Modo 2 — Stack Completa com Docker

Orquestra **MongoDB + BFF + Frontend** via Docker Compose.

### Estrutura de pastas necessária

Os repositórios devem estar lado a lado:

```
/dev/
├── tech_challenge_fiaap/   ← frontend (este repo)
└── tech-challenge-2/       ← BFF (backend)
```

### Clone os dois repositórios

```bash
git clone https://github.com/TatiRodrigues/tech_challenge_fiaap.git
git clone https://github.com/israelmeinert/tech-challenge-2.git
```

### Suba os containers

```bash
cd tech_challenge_fiaap

# Sobe MongoDB + BFF
docker compose up -d mongo bff

# Aguarda BFF ficar healthy (~30s) e inicia o frontend no host
npm install
npm run dev
```

Acesse: **http://localhost:3001**

### Verificar saúde dos containers

```bash
docker compose ps
docker logs tech-challenge-bff --tail 20
```

:::info Nota sobre Alpine/SWC
O serviço `app` no `docker-compose.yml` usa a imagem `node:20-slim` (Debian) para garantir compatibilidade com os binários SWC nativos do Next.js. Em versões anteriores era `node:20-alpine` que causava falha na compilação.
:::

---

## ☁️ Modo 3 — Deploy em Produção (Vercel)

Ver [Guia de Deploy](./deploy).

---

## Estrutura do Projeto

```
├── app/                   # Rotas Next.js (App Router)
│   ├── (autenticado)/     # Rotas protegidas — layout, resumo, listar, nova
│   ├── login/
│   ├── cadastro/
│   └── layout.tsx         # Root layout (ReduxProvider + skip link)
├── componentes/           # Componentes reutilizáveis
│   ├── features/          # financial-charts, file-upload, pagination, ...
│   ├── header/
│   ├── menu-lateral/
│   └── rodape/
├── config/                # MicrofrontendBus + eventos
├── store/                 # Redux Toolkit (slices, thunks, hooks)
├── utils/                 # Validação, filtros, upload
├── public/                # transactions.json (dados de exemplo)
├── vercel.json            # Configuração de deploy
├── docker-compose.yml     # Orquestração de containers
└── Dockerfile.dev         # Imagem frontend (node:20-slim)
```

## Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia em modo desenvolvimento (porta 3001) |
| `npm run build` | Gera build de produção |
| `npm run start` | Inicia a build de produção |
| `npm run lint` | Executa o linter |

## Acessar a Documentação (Docusaurus)

```bash
cd docs
npm install
npm run start
```

Acesse: **http://localhost:3002**
