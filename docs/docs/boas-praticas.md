---
sidebar_position: 3
title: Boas Práticas
description: Padrões de código
---

# 🎯 Boas Práticas

Padrões e convenções de código.

## Nomenclatura

- **Componentes**: PascalCase (`MyComponent`)
- **Variáveis**: camelCase (`myVariable`)
- **Constantes**: UPPER_SNAKE_CASE (`MY_CONSTANT`)
- **Handlers**: `handle` + Verbo (`handleClick`, `handleSubmit`)

## Componentes React

```tsx
// ✅ Bom
const MyComponent: React.FC<MyComponentProps> = (props) => {
  return <div>{props.children}</div>;
};

// ❌ Ruim
const myComponent = (props) => {
  return <div>{props.children}</div>;
};
```

## TypeScript

```tsx
// ✅ Use types
interface UserProps {
  name: string;
  email: string;
}

// ❌ Evite any
const user: any = {};
```

## Importações

```tsx
// ✅ Organize
import React from 'react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

// ❌ Desorganizado
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import React from 'react';
```

---

[Próximo: Referência de Código →](./REFERENCIA_CODIGO)
