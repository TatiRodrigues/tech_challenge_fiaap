---
sidebar_position: 3
title: Estado Redux
description: Gestão de estado com Redux Toolkit
---

# 🔄 Gestão de Estado (Redux)

Usamos **Redux Toolkit** para gestão de estado global e **Redux Persist** para persistência.

## Estrutura do Store

```
store/
├── index.ts                       # Configuração do store + persistência
├── hooks.ts                       # useAppDispatch, useAppSelector (tipados)
└── slices/
    ├── authSlice.ts                # Autenticação
    ├── transactionsSlice.ts        # Transações (modelo FIAP)
    └── bankingTransactionSlice.ts  # Integração API bancária
```

## Slices

### authSlice

```typescript
interface AuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

Actions: `loginUser` (thunk), `logoutUser` (thunk), `clearError`

### transactionsSlice

```typescript
interface Transaction {
  id: number;
  date: string;
  type: 'deposito' | 'saque' | 'transferencia';
  description: string;
  value: number;
  status: string;
}
```

Actions: `addTransaction`, `updateTransaction`, `deleteTransaction`, `setTransactions`

### bankingTransactionSlice

Integração com a API bancária externa. Actions: `fetchAccount` (thunk), `createTransaction` (thunk).

## Hooks tipados

```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';

// No componente:
const dispatch = useAppDispatch();
const { isAuthenticated, user } = useAppSelector((state) => state.auth);
```

## Persistência

O Redux Persist serializa o estado em `localStorage` automaticamente.  
Chave de armazenamento: `'root'`

## Thunks Disponíveis

```typescript
import { loginUser, logoutUser, fetchAccount, createTransaction } from '@/store/thunks';

// Login
dispatch(loginUser({ email: 'user@example.com', password: '1234' }));

// Logout
dispatch(logoutUser());

// Carregar conta (API bancária)
dispatch(fetchAccount());

// Criar transação (API bancária)
dispatch(createTransaction({ type: 'Credit', value: 100, ... }));
```
