---
sidebar_position: 1
title: Arquitetura
description: Arquitetura da aplicação
---

# 🏛️ Arquitetura

Arquitetura geral do Alecrim Finance - seu gerenciador de transações inteligente.

## Stack Tecnológico

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Styling**: Tailwind CSS + Bootstrap 5
- **Design System**: Baseado em [Portal](https://themes.3rdwavemedia.com/demo/portal/) de Xiaoying Riley, com customizações para Alecrim Finance
- **Documentação**: Docusaurus 3
- **Runtime**: Node.js 18+

## Estrutura de Diretórios

```
alecrim-finance/
├── app/              # Next.js App Router
├── componentes/      # Componentes reutilizáveis
├── hooks/            # Custom React hooks
├── docs/             # Documentação (Docusaurus)
└── public/           # Arquivos estáticos
```

## Fluxo de Dados

```
Pages → Components → Hooks → Services
```

## Camadas

1. **Pages**: Rotas e layouts
2. **Components**: UI reutilizáveis
3. **Hooks**: Lógica compartilhada
4. **Services**: Integração com API

---

[Próximo: API e Serviços →](./api-servicos)
