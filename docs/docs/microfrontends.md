---
sidebar_position: 2
title: Microfrontends
description: Arquitetura Module Federation
---

# 🧩 Microfrontends

Arquitetura microfrontend com **Webpack Module Federation** e **MicrofrontendBus** para comunicação entre módulos.

## Status

| Item | Status | Detalhes |
|------|--------|---------|
| `MicrofrontendBus` | ✅ Ativo | Eventos tipados + cross-tab via localStorage |
| Configuração Webpack | ✅ Ativa | `next.config.ts` — `webpack: (config) => { ... }` |
| `@module-federation/enhanced` | ✅ Instalado | Plugin `NextFederationPlugin` habilitado |
| Módulo host (3001) | ✅ Expõe | Header, MenuLateral, store, types |
| Módulo transactions (3002) | ⚠️ Pendente | Repo separado a criar |
| Módulo auth (3003) | ⚠️ Pendente | Repo separado a criar |

---

## Módulos Definidos

| Módulo | Porta | Responsabilidade |
|--------|-------|-----------------|
| `alecrim_wallet_host` | 3001 | Shell, Header, MenuLateral, roteamento |
| `alecrim_wallet_transactions` | 3002 | Listar/criar/editar transações |
| `alecrim_wallet_auth` | 3003 | Login, cadastro, recuperação de senha |

---

## Configuração (next.config.ts)

```typescript
webpack: (config, { isServer }) => {
  const { NextFederationPlugin } = require('@module-federation/enhanced/nextjs');
  config.plugins.push(
    new NextFederationPlugin({
      name: 'alecrim_wallet_host',
      filename: 'static/chunks/remoteEntry.js',
      remotes: {
        alecrim_wallet_transactions: `alecrim_wallet_transactions@${process.env.NEXT_PUBLIC_MFE_TRANSACTIONS_URL}/_next/static/chunks/remoteEntry.js`,
        alecrim_wallet_auth: `alecrim_wallet_auth@${process.env.NEXT_PUBLIC_MFE_AUTH_URL}/_next/static/chunks/remoteEntry.js`,
      },
      exposes: {
        './components/Header': './componentes/header/Header.tsx',
        './components/MenuLateral': './componentes/menu-lateral/MenuLateral.tsx',
        './hooks/useAuth': './hooks/useAuth.ts',
        './store': './store/index.ts',
        './types': './types/index.ts',
      },
      shared: {
        react: { singleton: true, eager: true, requiredVersion: '19.2.3' },
        'react-dom': { singleton: true, eager: true, requiredVersion: '19.2.3' },
        'react-redux': { singleton: true, requiredVersion: '^9.0.0' },
        '@reduxjs/toolkit': { singleton: true, requiredVersion: '^2.0.0' },
      },
    })
  );
  return config;
}
```

---

## Comunicação entre Módulos

O `MicrofrontendBus` (`config/microfrontend-advanced.ts`) fornece comunicação via eventos:

```typescript
import { MicrofrontendBus, MFEEvents, useMicrofrontendBus } from '@/config/microfrontend-advanced';

// Emitir evento
MicrofrontendBus.getInstance().emit(MFEEvents.Transaction.CREATED, transactionData);

// Escutar via hook
const { on } = useMicrofrontendBus();
on(MFEEvents.Auth.LOGOUT, () => router.push('/login'));
```

### Eventos registrados

| Evento | Emitido por | Consumido por |
|--------|-------------|---------------|
| `TRANSACTION_CREATED` | `FormularioTransacao` | Dashboard (atualiza saldo) |
| `AUTH_LOGOUT` | `Header` | Auth module (limpa estado) |

### Transporte de eventos

O `MicrofrontendBus` usa dois canais simultaneamente:
1. **`CustomEvent`** — comunicação intra-aba (mesma janela)
2. **`localStorage`** — comunicação cross-tab (múltiplas abas)

---

## Estrutura de Arquivos

```
config/
├── microfrontend.ts           # Definições de módulos e portas
└── microfrontend-advanced.ts  # MicrofrontendBus singleton, MFEEvents, useMicrofrontendBus
```

---

## Criar os Remotes (Próximo Passo)

Para ativar totalmente o Module Federation, criar dois repositórios adicionais:

```bash
# Transactions remote (porta 3002)
npx create-next-app@latest alecrim-transactions --typescript
cd alecrim-transactions
npm install @module-federation/enhanced

# Auth remote (porta 3003)
npx create-next-app@latest alecrim-auth --typescript
cd alecrim-auth
npm install @module-federation/enhanced
```

Cada remote deve expor seus componentes com `exposes` e rodar com `npm run dev -- -p 3002` / `3003`.

---

[← Arquitetura](./arquitetura) | [Estado Redux →](./estado-redux)
