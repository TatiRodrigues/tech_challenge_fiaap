# Aplicação de Gerenciamento Financeiro

Uma aplicação front-end desenvolvida em **Next.js** para gerenciamento de transações financeiras.

## Funcionalidades

- ✅ **Home Page**: Bem-vindo com saldo e últimas transações
- ✅ **Listagem de Transações**: Visualize, edite e delete transações
- ✅ **Adicionar Transação**: Modal para criar novas transações
- ✅ **Editar Transação**: Edite informações de transações existentes
- ✅ **Dados Mockados**: Utilizando arquivo JSON local

## Tecnologias

- **Next.js 14+**
- **React 18+**
- **Bootstrap 5**
- **TypeScript**

## Pré-requisitos

- Node.js 18+
- npm ou yarn

## Instalação

```bash
# Clone o repositório
git clone <seu-repositorio>

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse: **http://localhost:3000**

## Estrutura do Projeto

```
src/
├── app/
│   ├── layout.tsx                # Layout principal (com a Sidebar)
│   ├── not-found.tsx             # Erro 404
│   ├── page.tsx                  # Home (Dashboard/Resumo)
│   ├── nova-transacao/           # URL: /nova-transacao
│   │   └── page.tsx              # Importa o componente formulario-transacao
│   └── listar-transacoes/        # URL: /listar-transacoes
│       └── page.tsx              # Importa o componente lista-transacoes
├── _componentes/
│   ├── ui/                       # Componentes base (botao, input)
│   │   └── botao.tsx
│   └── features/                 # Componentes de negócio
│       ├── formulario-transacao/
│       │   └── index.tsx         # Antigo AdicionarNovaTransacao
│       ├── lista-transacoes/
│       │   └── index.tsx         # Antigo ListaTransacoes
│       ├── menu-lateral/
│       │   └── index.tsx         # Antigo MenuLateral
│       └── resumo-geral/
│           └── index.tsx         # Antigo ResumoGeral
├── dados/                        # Para arquivos JSON locais
│   └── transacoes.json    
└── tipos/                        # Interfaces TypeScript
    └── transacao.ts

```

## Dados Mockados

Os dados estão em `public/transactions.json` e incluem:
- ID único para cada transação
- Tipo (depósito, transferência, saque)
- Valor e data
- Descrição e status

## Uso

1. **Home Page**: Visualize seu saldo e últimas transações
2. **Adicionar**: Clique em "Adicionar" no card lateral
3. **Editar**: Clique no botão "Editar" na listagem
4. **Deletar**: Clique no botão "Deletar" para remover

## Design

Interface moderna com Bootstrap 5 e responsiva para mobile.

## Scripts

```bash
npm run dev      # Desenvolvimento
npm run build    # Build para produção
npm run start    # Servidor de produção
npm run lint     # Verificar código
```
