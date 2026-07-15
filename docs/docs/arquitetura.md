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
| **Docusaurus** | 3 | Documentação |
| **Node.js** | 20 | Runtime |

## Fluxo de Dados

```
Pages (Server) → Client Components → Redux Store → localStorage
                                   ↓
                              API Bancária (opcional)
```

## Camadas

1. **Server Components** — `page.tsx` / `layout.tsx`: SSR + Metadata para SEO
2. **Client Components** — `client.tsx`: lógica interativa, hooks, estado local
3. **Redux Store** — estado global: autenticação, transações
4. **Serviços** — integração com API bancária (opcional)
5. **localStorage** — persistência de transações e autenticação local

## Padrão SSR + Client

Cada rota usa o padrão `page.tsx` (server) + `client.tsx` (client):

```
app/(autenticado)/listar-transacoes/
├── page.tsx     ← export metadata (SSR) + renderiza <ListarTransacoesClient />
└── client.tsx   ← 'use client' — toda a lógica interativa
```

## Acessibilidade (WCAG 2.1 AA)

- Skip link (`Pular para o conteúdo`) antes do header
- Todos os modais: `role="dialog"`, `aria-modal`, `aria-labelledby`, fecham com `Escape`
- Foco automático ao abrir modais via `ref.focus()`
- Tabelas: `scope="col"` nos `<th>`
- Botões de ação: `aria-label` descritivo por transação
- Alternância tabela/cards: `aria-pressed`
- Ícones decorativos: `aria-hidden="true"`
- Filtros ativos: `aria-live="polite"`

---

[Microfrontends →](./microfrontends) | [Estado Redux →](./estado-redux) | [SSR & SSG →](./ssr-ssg)
