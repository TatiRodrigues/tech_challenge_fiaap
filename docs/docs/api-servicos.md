---
sidebar_position: 2
title: API e Serviços
description: Endpoints e serviços disponíveis
---

# 🔌 API e Serviços

Documentação de APIs e serviços.

## Endpoints Principais

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/login` | Fazer login |
| POST | `/api/auth/register` | Registrar usuário |
| POST | `/api/auth/logout` | Fazer logout |
| GET | `/api/auth/me` | Usuário atual |

### Transações

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/transactions` | Listar transações |
| POST | `/api/transactions` | Criar transação |
| GET | `/api/transactions/:id` | Detalhe |
| PUT | `/api/transactions/:id` | Atualizar |
| DELETE | `/api/transactions/:id` | Deletar |

### Resumo

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/summary` | Resumo geral |
| GET | `/api/summary/by-category` | Por categoria |
| GET | `/api/summary/by-date` | Por data |

## Autenticação

Use token JWT no header:
```
Authorization: Bearer <token>
```

---

[Próximo: Boas Práticas →](./boas-praticas)
