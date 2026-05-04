---
sidebar_position: 4
title: Referência de Código
description: Estrutura de arquivos e padrões
---

# 📚 Referência de Código

Estrutura e padrões do código.

## Estrutura de Arquivos

```
app/
├── (autenticado)/          # Layout com autenticação
│   ├── layout.tsx
│   ├── page.tsx
│   ├── listar-transacoes/
│   ├── nova-transacao/
│   └── resumo-transacao/
├── login/
│   ├── page.tsx
│   └── login.css
├── cadastro/
│   └── page.tsx
├── layout.tsx              # Layout raiz
└── page.tsx

componentes/
├── features/               # Componentes de funcionalidade
│   ├── cards-resumo/
│   ├── formulario-transacao/
│   ├── listar-transacoes/
│   └── modal-editar-transacao/
├── header/
├── menu-lateral/
└── rodape/

hooks/
├── useProtectedRoute.ts
└── useTransactions/

servicos/
└── auth.ts
```

## Padrões de Arquivo

### Componente
```
componente/
├── index.tsx          # Exportação
├── styles.css         # Estilos
└── types.ts           # Types
```

### Hook
```
hooks/useMyHook.ts
```

### Página
```
app/minha-pagina/
├── page.tsx           # Conteúdo
└── layout.tsx         # Layout (opcional)
```

---

[Próximo: Componentes Layout →](./componentes-layout)
