---
sidebar_position: 4
title: SSR & SSG
description: Server-Side Rendering e Static Site Generation
---

# ⚡ SSR & SSG

## Server-Side Rendering com Next.js App Router

Todas as rotas principais usam **Server Components** com `export metadata` para SEO otimizado.

## Padrão Implementado

Cada rota autenticada segue o padrão `page.tsx` (server) + `client.tsx` (client):

```typescript
// app/(autenticado)/listar-transacoes/page.tsx
import type { Metadata } from 'next';
import ListarTransacoesClient from './client';

export const metadata: Metadata = {
  title: 'Transações | Alecrim Wallet',
  description: 'Visualize, filtre e gerencie suas transações financeiras.',
};

export default function ListarTransacoesPage() {
  return <ListarTransacoesClient />;
}
```

```typescript
// app/(autenticado)/listar-transacoes/client.tsx
'use client';

// Toda a lógica interativa: useState, useEffect, handlers, etc.
export default function ListarTransacoesClient() { ... }
```

## Rotas com SSR + Metadata

| Rota | Arquivo Server | Metadata |
|------|---------------|---------|
| `/login` | `login/layout.tsx` | ✅ |
| `/cadastro` | `cadastro/layout.tsx` | ✅ |
| `/esqueceu-senha` | `esqueceu-senha/layout.tsx` | ✅ |
| `/(autenticado)/resumo-transacao` | `page.tsx` | ✅ |
| `/(autenticado)/nova-transacao` | `page.tsx` | ✅ |
| `/(autenticado)/listar-transacoes` | `page.tsx` | ✅ |

## Benefícios

### SEO
- Tags `<title>` e `<meta description>` geradas no servidor
- Open Graph tags configuráveis via `metadata`
- Sem JavaScript necessário para o crawler indexar

### Performance
- HTML inicial gerado no servidor (sem blank flash)
- Componentes interativos carregam com `'use client'` apenas quando necessário
- Code splitting automático entre server e client components

## Metadata Global

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: 'Alecrim Wallet',
    template: '%s | Alecrim Wallet',
  },
  description: 'Gerenciador de transações financeiras pessoais',
};
```
