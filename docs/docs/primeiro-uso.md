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

## Executar localmente

```bash
# 1. Clone
git clone https://github.com/TatiRodrigues/tech_challenge_fiaap.git
cd tech_challenge_fiaap

# 2. Instale dependências
npm install

# 3. Inicie o servidor
npm run dev
```

Acesse: **http://localhost:3001**

### Credenciais padrão

```
Email: teste@gmail.com
Senha: testes
Username: Aluno Carequinha
```

## Estrutura do Projeto

```
├── app/                   # Rotas Next.js (App Router)
│   ├── (autenticado)/     # Rotas protegidas
│   ├── login/
│   ├── cadastro/
│   └── layout.tsx
├── componentes/           # Componentes reutilizáveis
├── store/                 # Redux store
├── config/                # Microfrontend config
├── utils/                 # Utilitários
├── docs/                  # Documentação (Docusaurus)
└── public/                # Arquivos estáticos
```

## Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia em modo desenvolvimento (porta 3001) |
| `npm run build` | Gera build de produção |
| `npm run start` | Inicia a build de produção |
| `npm run lint` | Executa o linter |

## Acessar a Documentação

```bash
cd docs
npm install
npm run start
```

Acesse: **http://localhost:3002**

## Próximas Etapas

- [Arquitetura](./arquitetura) — Entender a estrutura técnica
- [Microfrontends](./microfrontends) — Module Federation
- [Estado Redux](./estado-redux) — Gestão de estado
- [Design System](./design-system/) — Componentes visuais
