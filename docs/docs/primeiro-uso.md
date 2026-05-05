---
sidebar_position: 1
title: Primeiro Uso
description: Guia de primeiro uso da Alecrim Wallet
---

# 📚 Primeiro Uso

Seu guia para começar com o Alecrim Wallet - seu gerenciador de transações inteligente.

## 1️⃣ Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Setup

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/alecrim-finance.git
cd alecrim-finance

# Instale dependências
npm install

# Inicie o desenvolvimento
npm run dev
```

## 2️⃣ Estrutura do Projeto

```
alecrim-finance/
├── app/                      # Aplicação Next.js
│   ├── (autenticado)/       # Rotas protegidas
│   ├── login/               # Página de login
│   ├── cadastro/            # Página de cadastro
│   └── layout.tsx           # Layout raiz
├── componentes/             # Componentes reutilizáveis
├── hooks/                   # Custom hooks
├── docs/                    # Documentação (Docusaurus)
└── public/                  # Arquivos estáticos
```

## 3️⃣ Primeiros Passos

### Criar um Novo Componente

```tsx
// componentes/meu-componente/index.tsx
import React from 'react';

export const MeuComponente: React.FC = () => {
  return <div>Meu Componente</div>;
};
```

### Usar um Componente

```tsx
import { Button } from '@/componentes/ui/Button';

export default function MinhaPage() {
  return (
    <Button onClick={() => alert('Clicado!')}>
      Clique aqui
    </Button>
  );
}
```

## 4️⃣ Acessar a Documentação

### Local
```bash
cd docs
npm run start
```
Acesse: http://localhost:3002

### Online
Visite: https://alecrim-finance-docs.vercel.app

## 5️⃣ Próximas Etapas

- ✅ Leia o [Design System](./design-system/index)
- ✅ Explore os [Componentes](./componentes/index)
- ✅ Veja [Exemplos Práticos](./componentes/guia-rapido)
- ✅ Contribua com [Guia de Contribuição](./guia-contribuicao)

---

**Próximo:** [Design System](./design-system/index)
