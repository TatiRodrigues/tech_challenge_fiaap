# 🔌 Guia de Integração - API Bancária

Este guia explica como usar a integração com a API Bancária (tech-challenge-2) no projeto.

## 📋 Índice

1. [Setup Inicial](#setup-inicial)
2. [Autenticação](#autenticação)
3. [Operações com Transações](#operações-com-transações)
4. [Erro e Tratamento](#erro-e-tratamento)
5. [Exemplos Práticos](#exemplos-práticos)
6. [API Reference](#api-reference)

---

## Setup Inicial

### 1. Configurar Variáveis de Ambiente

```bash
# .env.local
NEXT_PUBLIC_USE_BANKING_API=true
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_API_TIMEOUT=10000
```

### 2. Iniciar a API Bancária

```bash
# Terminal 1 - API
cd ../tech-challenge-2
npm install
npm run dev
# API rodando em http://localhost:3000
```

### 3. Iniciar o Frontend

```bash
# Terminal 2 - Frontend
npm install
npm run dev
# Frontend em http://localhost:3000 (porta diferente após API subir)
```

---

## Autenticação

### Registrar Novo Usuário

```typescript
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '@/store/thunks';

export function RegisterPage() {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await dispatch(registerUser({
      username: 'Seu Nome',
      email: 'seu@email.com',
      password: 'sua_senha'
    }));

    if (result.type === registerUser.fulfilled.type) {
      // Sucesso - redirecionar para login
      router.push('/login');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      {error && <div className="alert alert-danger">{error}</div>}
      {/* ... formulário ... */}
    </form>
  );
}
```

### Fazer Login

```typescript
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/store/thunks';
import { bankingApi } from '@/app/servicos/banking-api';

export function LoginPage() {
  const dispatch = useDispatch();
  const { isLoading, error, isAuthenticated } = useSelector(state => state.auth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await dispatch(loginUser({
      email: 'seu@email.com',
      password: 'sua_senha'
    }));

    if (result.type === loginUser.fulfilled.type) {
      // Token foi salvo automaticamente
      // Redirecionar para dashboard
      router.push('/dashboard');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <div className="alert alert-danger">{error}</div>}
      {/* ... formulário ... */}
    </form>
  );
}
```

### Fazer Logout

```typescript
import { useDispatch } from 'react-redux';
import { logoutUser } from '@/store/thunks';

export function LogoutButton() {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push('/login');
  };

  return <button onClick={handleLogout}>Sair</button>;
}
```

---

## Operações com Transações

### Carregar Conta e Transações

```typescript
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccount } from '@/store/thunks';
import { useEffect } from 'react';

export function DashboardPage() {
  const dispatch = useDispatch();
  const {
    items: transactions,
    accounts,
    cards,
    isLoading,
    error
  } = useSelector(state => state.bankingTransactions);

  useEffect(() => {
    // Carregar dados quando componente monta
    dispatch(fetchAccount());
  }, [dispatch]);

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h2>Saldo das Contas</h2>
      {accounts.map(account => (
        <div key={account.id} className="card">
          <div>ID: {account.id}</div>
          <div>Tipo: {account.type}</div>
        </div>
      ))}

      <h2>Transações Recentes</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.slice(0, 5).map(tx => (
            <tr key={tx.id}>
              <td>{new Date(tx.date).toLocaleDateString()}</td>
              <td>{tx.type}</td>
              <td>{tx.value}</td>
              <td>{tx.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Cartões</h2>
      {cards.map(card => (
        <div key={card.id} className="card">
          <div>Número: {card.number}</div>
          <div>Nome: {card.name}</div>
          <div>Status: {card.is_blocked ? 'Bloqueado' : 'Ativo'}</div>
        </div>
      ))}
    </div>
  );
}
```

### Criar Transação

```typescript
import { useDispatch, useSelector } from 'react-redux';
import { createTransaction, fetchAccount } from '@/store/thunks';
import { useState } from 'react';

export function NewTransactionForm() {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.bankingTransactions);
  const { items: transactions } = useSelector(state => state.bankingTransactions);
  
  // Pegar primeiro account disponível (em produção, usar seletor)
  const accountId = transactions[0]?.accountId || 'seu-account-id';

  const [formData, setFormData] = useState({
    type: 'Credit',
    value: 0,
    from: '',
    to: '',
    anexo: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await dispatch(createTransaction({
      accountId,
      type: formData.type as 'Credit' | 'Debit',
      value: formData.value,
      from: formData.from,
      to: formData.to,
      anexo: formData.anexo
    }));

    if (result.type === createTransaction.fulfilled.type) {
      alert('Transação criada com sucesso!');
      setFormData({ type: 'Credit', value: 0, from: '', to: '', anexo: '' });
      // Recarregar dados
      dispatch(fetchAccount());
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <label>Tipo</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="form-select"
        >
          <option value="Credit">Crédito (Entrada)</option>
          <option value="Debit">Débito (Saída)</option>
        </select>
      </div>

      <div className="mb-3">
        <label>Valor</label>
        <input
          type="number"
          step="0.01"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
          className="form-control"
          required
        />
      </div>

      <div className="mb-3">
        <label>De</label>
        <input
          type="text"
          value={formData.from}
          onChange={(e) => setFormData({ ...formData, from: e.target.value })}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label>Para</label>
        <input
          type="text"
          value={formData.to}
          onChange={(e) => setFormData({ ...formData, to: e.target.value })}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label>Anexo (URL)</label>
        <input
          type="text"
          value={formData.anexo}
          onChange={(e) => setFormData({ ...formData, anexo: e.target.value })}
          className="form-control"
          placeholder="URL do arquivo"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary"
      >
        {isLoading ? 'Criando...' : 'Criar Transação'}
      </button>
    </form>
  );
}
```

### Atualizar Transação

```typescript
import { updateTransaction } from '@/store/thunks';

export function UpdateTransactionForm({ transactionId }) {
  const dispatch = useDispatch();

  const handleUpdate = async (newData) => {
    const result = await dispatch(updateTransaction({
      transactionId,
      payload: {
        type: 'Credit',
        value: newData.value,
        from: newData.from,
        to: newData.to,
        anexo: newData.anexo
      }
    }));

    if (result.type === updateTransaction.fulfilled.type) {
      alert('Transação atualizada!');
    }
  };

  return (
    // ... formulário de atualização
  );
}
```

### Deletar Transação

```typescript
import { deleteTransaction } from '@/store/thunks';

export function TransactionRow({ transaction }) {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja deletar?')) return;

    const result = await dispatch(deleteTransaction(transaction.id));

    if (result.type === deleteTransaction.fulfilled.type) {
      alert('Transação deletada!');
    }
  };

  return (
    <tr>
      <td>{transaction.type}</td>
      <td>{transaction.value}</td>
      <td>
        <button
          onClick={handleDelete}
          className="btn btn-sm btn-danger"
        >
          Deletar
        </button>
      </td>
    </tr>
  );
}
```

### Buscar Extrato

```typescript
import { useDispatch } from 'react-redux';
import { fetchStatement } from '@/store/thunks';

export function StatementPage({ accountId }) {
  const dispatch = useDispatch();
  const { items: transactions, isLoading } = useSelector(
    state => state.bankingTransactions
  );

  const handleFetchStatement = async () => {
    await dispatch(fetchStatement(accountId));
  };

  return (
    <div>
      <button onClick={handleFetchStatement} className="btn btn-primary">
        Carregar Extrato
      </button>

      {isLoading && <div>Carregando...</div>}

      <table className="table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Tipo</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.id}>
              <td>{new Date(tx.date).toLocaleDateString()}</td>
              <td>{tx.type}</td>
              <td>{tx.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## Erro e Tratamento

### Tratamento de Erros Global

```typescript
// store/middleware/errorMiddleware.ts
import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';

export const errorMiddleware: Middleware = store => next => action => {
  if (isRejectedWithValue(action)) {
    console.error('Erro detectado:', action.payload);
    
    // Mostrar notificação para usuário
    const errorMessage = action.payload?.message || 'Erro ao processar requisição';
    
    // Você pode usar um toast/notificação aqui
    showErrorNotification(errorMessage);
  }

  return next(action);
};

function showErrorNotification(message: string) {
  // Implementar notificação
  alert(message);
}
```

### Tratamento de Erro em Componentes

```typescript
const { error, clearError } = useSelector(state => state.bankingTransactions);

useEffect(() => {
  if (error) {
    // Mostrar erro ao usuário
    toast.error(error);
    
    // Limpar após 5 segundos
    const timer = setTimeout(() => {
      dispatch(clearError());
    }, 5000);

    return () => clearTimeout(timer);
  }
}, [error, dispatch]);
```

---

## Exemplos Práticos

### Dashboard Completo

```typescript
export function CompleteDashboard() {
  const dispatch = useDispatch();
  const { transactions, accounts, cards, isLoading } = useSelector(
    state => state.bankingTransactions
  );

  useEffect(() => {
    dispatch(fetchAccount());
  }, [dispatch]);

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5>Total de Transações</h5>
              <h2>{transactions.length}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5>Contas</h5>
              <h2>{accounts.length}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5>Cartões</h5>
              <h2>{cards.length}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <h3>Últimas Transações</h3>
          {isLoading ? (
            <div>Carregando...</div>
          ) : (
            <table className="table">
              <tbody>
                {transactions.slice(0, 5).map(tx => (
                  <tr key={tx.id}>
                    <td>{new Date(tx.date).toLocaleDateString()}</td>
                    <td>{tx.type}</td>
                    <td>{tx.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="col-md-6">
          <h3>Meus Cartões</h3>
          {cards.map(card => (
            <div key={card.id} className="card mb-2">
              <div className="card-body">
                <div>{card.name}</div>
                <div>****{card.number.slice(-4)}</div>
                <div className={card.is_blocked ? 'text-danger' : 'text-success'}>
                  {card.is_blocked ? 'Bloqueado' : 'Ativo'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## API Reference

### Thunks Disponíveis

| Thunk | Ação | Descrição |
|-------|------|-----------|
| `loginUser` | `loginUser({ email, password })` | Fazer login |
| `registerUser` | `registerUser({ username, email, password })` | Registrar novo usuário |
| `logoutUser` | `logoutUser()` | Fazer logout |
| `fetchAccount` | `fetchAccount()` | Carregar conta e transações |
| `createTransaction` | `createTransaction({...})` | Criar transação |
| `updateTransaction` | `updateTransaction({ transactionId, payload })` | Atualizar transação |
| `deleteTransaction` | `deleteTransaction(transactionId)` | Deletar transação |
| `fetchStatement` | `fetchStatement(accountId)` | Buscar extrato |

### Selectors

```typescript
// Autenticação
const { user, token, isAuthenticated, isLoading, error } = useSelector(state => state.auth);

// Transações Bancárias
const { items, accounts, cards, isLoading, error } = useSelector(
  state => state.bankingTransactions
);
```

---

**Última atualização**: 14/06/2026
