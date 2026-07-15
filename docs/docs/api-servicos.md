---
sidebar_position: 2
title: API e Serviços
description: Endpoints BFF e configuração do serviço bancário
---

# 🔌 API e Serviços

## BFF (Backend for Frontend)

O BFF é um serviço Node.js rodando na porta **3000** (container `bff`). O frontend se comunica com ele via `app/servicos/banking-api.ts`.

### Base URL

```
http://localhost:3000   (desenvolvimento via Docker)
${NEXT_PUBLIC_API_URL}  (produção via variável de ambiente)
```

---

## Endpoints

### Autenticação

| Método | Endpoint | Body | Resposta |
|--------|----------|------|---------|
| POST | `/user/auth` | `{ email, password }` | `{ token, account: { name, ... } }` |
| POST | `/user` | `{ name, username, email, password }` | `{ token, account }` |

### Conta / Saldo

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| GET | `/account` | `Bearer <token>` | Dados da conta + saldo atual |

### Transações

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| GET | `/account/transactions` | `Bearer <token>` | Listar todas as transações |
| POST | `/account/transactions` | `Bearer <token>` | Criar nova transação |

#### Body para criar transação

```json
{
  "type": "Credit",
  "value": 150.00,
  "description": "Salário"
}
```

> Valores `type`: `"Credit"` (depósito) | `"Debit"` (saque/pagamento)

---

## Autenticação

Todas as rotas protegidas exigem o header:

```
Authorization: Bearer <token>
```

O token é salvo em `localStorage` com a chave `bankingApiToken` e gerenciado pelo `BankingApiService`.

---

## Dados de Exemplo (sem BFF)

Quando o BFF não está disponível, a aplicação usa dados locais:

```
public/transactions.json   ← 26 transações de exemplo
```

O serviço de autenticação fallback (`app/servicos/auth.ts`) valida:

```
Email: teste@gmail.com
Senha: testes
```

---

## Variáveis de Ambiente

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_MFE_TRANSACTIONS_URL=http://localhost:3002
NEXT_PUBLIC_MFE_AUTH_URL=http://localhost:3003
```

Crie um arquivo `.env.local` na raiz do projeto para desenvolvimento local.

---

[← Primeiro Uso](./primeiro-uso) | [Deploy →](./deploy) | [Microfrontends →](./microfrontends)
