---
sidebar_position: 2
title: Button
description: Componente Button - Botões para ações
---

# Button

O `Button` é um componente que dispara ações quando clicado. É um elemento fundamental em qualquer interface de usuário.

## Configurador

Customize o botão com as opções abaixo e veja a mudança em tempo real.

### Exemplo Interativo

```tsx
import { Button } from '@/components/ui/Button';

export default function ButtonConfigurator() {
  // Propriedades configuráveis
  const [variant, setVariant] = React.useState<'primary' | 'secondary' | 'outline'>('primary');
  const [size, setSize] = React.useState<'sm' | 'md' | 'lg'>('md');
  const [disabled, setDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(false);

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Variante</label>
          <select 
            value={variant} 
            onChange={(e) => setVariant(e.target.value as any)}
            className="w-full px-3 py-2 border rounded"
          >
            <option>primary</option>
            <option>secondary</option>
            <option>outline</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tamanho</label>
          <select 
            value={size} 
            onChange={(e) => setSize(e.target.value as any)}
            className="w-full px-3 py-2 border rounded"
          >
            <option>sm</option>
            <option>md</option>
            <option>lg</option>
          </select>
        </div>

        <label className="flex items-end gap-2">
          <input 
            type="checkbox" 
            checked={disabled} 
            onChange={(e) => setDisabled(e.target.checked)}
          />
          <span className="text-sm">Desabilitado</span>
        </label>

        <label className="flex items-end gap-2">
          <input 
            type="checkbox" 
            checked={loading} 
            onChange={(e) => setLoading(e.target.checked)}
          />
          <span className="text-sm">Carregando</span>
        </label>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 p-8 rounded-lg flex items-center justify-center">
        <Button 
          variant={variant}
          size={size}
          disabled={disabled}
          loading={loading}
          fullWidth={fullWidth}
        >
          {loading ? 'Carregando...' : 'Clique aqui'}
        </Button>
      </div>

      {/* Código */}
      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <pre>{`<Button
  variant="${variant}"
  size="${size}"
  disabled={${disabled}}
  loading={${loading}}
>
  Clique aqui
</Button>`}</pre>
      </div>
    </div>
  );
}
```

### Propriedades

| Propriedade | Tipo | Padrão | Descrição |
|------------|------|--------|-----------|
| **variant** | `'primary' \| 'secondary' \| 'outline'` | `'primary'` | Estilo do botão |
| **size** | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamanho do botão |
| **disabled** | `boolean` | `false` | Se o botão está desabilitado |
| **loading** | `boolean` | `false` | Se está em estado de carregamento |
| **fullWidth** | `boolean` | `false` | Se o botão ocupa toda a largura |
| **type** | `'button' \| 'submit' \| 'reset'` | `'button'` | Tipo de botão HTML |
| **onClick** | `(e: MouseEvent) => void` | — | Callback ao clicar |
| **children** | `ReactNode` | — | Conteúdo do botão |

---

## Exemplos

### Variantes Básicas

```tsx
<div className="flex gap-4">
  <Button variant="primary">Primário</Button>
  <Button variant="secondary">Secundário</Button>
  <Button variant="outline">Outline</Button>
</div>
```

### Tamanhos

```tsx
<div className="flex gap-4">
  <Button size="sm">Small</Button>
  <Button size="md">Medium</Button>
  <Button size="lg">Large</Button>
</div>
```

### Estados

```tsx
<div className="flex gap-4">
  <Button>Normal</Button>
  <Button loading>Carregando</Button>
  <Button disabled>Desabilitado</Button>
</div>
```

### Com Ícones

```tsx
<div className="flex gap-4">
  <Button>
    <i className="bi bi-download mr-2"></i>
    Download
  </Button>
  <Button variant="outline">
    <i className="bi bi-trash mr-2"></i>
    Deletar
  </Button>
</div>
```

### Largura Completa

```tsx
<div className="space-y-2">
  <Button fullWidth>Salvar</Button>
  <Button variant="outline" fullWidth>Cancelar</Button>
</div>
```

### Grupo de Botões

```tsx
<div className="flex gap-2">
  <Button variant="outline" size="sm">Anterior</Button>
  <Button size="sm">1</Button>
  <Button variant="outline" size="sm">2</Button>
  <Button variant="outline" size="sm">Próximo</Button>
</div>
```

---

## Guia de Uso

### Quando Usar

- ✅ Para ações primárias (enviar, salvar, confirmar)
- ✅ Para ações secundárias (cancelar, limpar)
- ✅ Para navegar entre páginas
- ✅ Para abrir modals ou menus

### Quando Não Usar

- ❌ Para navegação principal (use links)
- ❌ Para demonstrar que algo é clicável mas desabilitado permanentemente (remova o elemento)

### Boas Práticas

1. **Use textos descritivos**
   ```tsx
   ✅ <Button>Confirmar Transação</Button>
   ❌ <Button>OK</Button>
   ```

2. **Variante correta para contexto**
   ```tsx
   ✅ <Button variant="primary">Enviar</Button>
   ✅ <Button variant="outline">Cancelar</Button>
   ```

3. **Mantenha estado de carregamento**
   ```tsx
   <Button loading onClick={async () => {
     await saveData();
     setLoading(false);
   }}>
     Salvar
   </Button>
   ```

4. **Sempre tenha um escape**
   ```tsx
   <div>
     <Button>Confirmar</Button>
     <Button variant="outline">Cancelar</Button>
   </div>
   ```

---

## Acessibilidade

### Navegação por Teclado

- `Tab` - Move o foco para o próximo elemento
- `Shift+Tab` - Move para elemento anterior
- `Enter` ou `Space` - Ativa o botão

### Estados de Foco

O botão sempre mostra um indicador de foco visível:

```tsx
<Button className="focus:ring-2 focus:ring-offset-2 focus:ring-primary">
  Visível ao focar
</Button>
```

### Texto Descritivo

Para botões com apenas ícones, use `aria-label`:

```tsx
<Button aria-label="Deletar item">
  <i className="bi bi-trash"></i>
</Button>
```

### Estados Desabilitados

O botão desabilitado tem `aria-disabled`:

```tsx
<Button disabled aria-disabled="true">
  Não disponível
</Button>
```

### Eventos Assíncronos

Sempre comunique estado de carregamento:

```tsx
<Button loading aria-busy="true">
  Salvando...
</Button>
```

### WCAG Compliance

- ✅ Contraste 4.5:1 em relação ao fundo
- ✅ Focus visível em todos os estados
- ✅ Suporta navegação por teclado
- ✅ Funciona com leitores de tela

---

## API

### Props

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Variante visual do botão
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'outline';

  /**
   * Tamanho do botão
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Se o botão está em estado de carregamento
   * @default false
   */
  loading?: boolean;

  /**
   * Se o botão ocupa toda a largura disponível
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Conteúdo do botão
   */
  children: React.ReactNode;

  /**
   * Callback ao clicar
   */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
```

### Exemplo Completo

```tsx
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export default function MyComponent() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await saveToDB();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="primary"
        size="md"
        loading={isLoading}
        onClick={handleSave}
      >
        Salvar
      </Button>
      <Button variant="outline">
        Cancelar
      </Button>
    </div>
  );
}
```

---

**Próximo**: [Input](../input)
