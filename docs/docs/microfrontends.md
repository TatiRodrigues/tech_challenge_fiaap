---
sidebar_position: 2
title: Microfrontends
description: Arquitetura Module Federation
---

# 🧩 Microfrontends

Arquitetura microfrontend com **Webpack Module Federation**.

## Módulos Definidos

| Módulo | Porta | Responsabilidade |
|--------|-------|-----------------|
| `alecrim_wallet_host` | 3001 | Shell, Header, MenuLateral, roteamento |
| `alecrim_wallet_transactions` | 3002 | Listar/criar/editar transações |
| `alecrim_wallet_auth` | 3003 | Login, cadastro, recuperação de senha |

## Configuração (next.config.ts)

A configuração Webpack está pronta e comentada em `next.config.ts`. Para ativar:

```bash
# 1. Instalar o plugin
npm install @module-federation/nextjs-mf

# 2. Em next.config.ts:
#    - Remover a linha: turbopack: {}
#    - Descomentar o bloco: webpack: (config, ...) => { ... }

# 3. Reiniciar
npm run dev
```

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

## Estrutura de Arquivos

```
config/
├── microfrontend.ts           # Definições de módulos e portas
└── microfrontend-advanced.ts  # MicrofrontendBus singleton, MFEEvents, useMicrofrontendBus
```

## Roteamento

Com Module Federation ativo, cada módulo é uma aplicação independente:
- O host (porta 3001) gerencia o roteamento global
- Os módulos `transactions` e `auth` expõem seus componentes/páginas via `exposes`
- O host consome os módulos remotos via `remotes`
