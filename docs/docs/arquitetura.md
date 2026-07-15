---
sidebar_position: 1
title: Arquitetura
description: Arquitetura técnica da aplicação
---

# 🏛️ Arquitetura

## Stack Tecnológico

| Tecnologia | Versão | Papel |
|-----------|--------|-------|
| **Next.js** | 16 | Framework (SSR/SSG, App Router) |
| **React** | 19 | UI Library |
| **TypeScript** | 5 | Tipagem estática |
| **Redux Toolkit** | 2 | Gestão de estado global |
| **Redux Persist** | 6 | Persistência de estado |
| **Bootstrap** | 5 | Estilos e responsividade |
| **Webpack** | 5 | Bundler (Module Federation) |
| **Docker** | 24+ | Containerização |
| **Node.js** | 20 | Runtime |

## Infraestrutura

```
┌──────────────────────────────────────────────────────────┐
│                     Docker Compose                        │
│                                                           │
│  ┌──────────┐    ┌──────────────┐    ┌────────────────┐  │
│  │ MongoDB  │◄───│  BFF Node.js │◄───│ Next.js :3001  │  │
│  │  :27017  │    │   :3000      │    │ (host Windows) │  │
│  └──────────┘    └──────────────┘    └────────────────┘  │
│  (container)      (container)                             │
└──────────────────────────────────────────────────────────┘
```

> **Nota:** O frontend roda no host em Windows (não em container) por limitação dos binários SWC nativos do Next.js — o Dockerfile.dev usa `node:20-slim` (Debian/glibc) para ambientes Linux.

## Fluxo de Dados

```
Browser → Next.js (SSR/Client) → Redux Store → BFF API → MongoDB
                                      ↓
                               localStorage (cache local)
```

## Camadas

1. **Server Components** (`page.tsx` / `layout.tsx`) — SSR + Metadata para SEO
2. **Client Components** (`client.tsx`) — lógica interativa, hooks, estado local
3. **Redux Store** — estado global: autenticação, transações
4. **Serviços** (`app/servicos/`) — integração com BFF via Axios
5. **localStorage** — `bankingApiToken`, `currentUser`, `user_transactions`

## Padrão SSR + Client

Cada rota autenticada usa o padrão `page.tsx` (server) + `client.tsx` (client):

```
app/(autenticado)/listar-transacoes/
├── page.tsx     ← export metadata (SEO) + renderiza <ListarTransacoesClient />
└── client.tsx   ← 'use client' — toda a lógica interativa
```

## Acessibilidade (WCAG 2.1 AA)

- **Skip link** "Pular para o conteúdo principal" visível ao pressionar Tab
- **Landmarks**: `<header role="banner">`, `<nav aria-label>`, `<main>`, `<footer role="contentinfo">`
- Labels **visíveis** em todos os formulários (não mais `sr-only`)
- `aria-current="page"` nos links do menu lateral
- Modais: `role="dialog"`, `aria-modal`, `aria-labelledby`, fecham com ESC, foco automático
- `aria-live="assertive"` em erros; `aria-live="polite"` em sucesso e contagem de resultados
- `aria-busy` nos botões de submit durante carregamento
- `aria-hidden="true"` em ícones decorativos
- Contraste corrigido: badge "Pendente" usa `text-dark` (12:1 sobre amarelo, WCAG AA ✅)
- Mínimo 44×44px nas áreas clicáveis (WCAG 2.5.5)
- `prefers-reduced-motion` e `prefers-contrast` respeitados via CSS

---

[Microfrontends →](./microfrontends) | [Estado Redux →](./estado-redux) | [SSR & SSG →](./ssr-ssg) | [Deploy →](./deploy)
