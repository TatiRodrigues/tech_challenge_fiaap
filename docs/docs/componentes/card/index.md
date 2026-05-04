---
sidebar_position: 4
title: Card
description: Componente Card - Contêiner de conteúdo
---

# Card

O `Card` é um componente contêiner que agrupa conteúdo relacionado em um espaço delimitado.

## Configurador

```tsx
import { Card } from '@/components/ui/Card';

export default function CardConfigurator() {
  const [shadow, setShadow] = React.useState<'sm' | 'md' | 'lg'>('md');
  const [border, setBorder] = React.useState(true);

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Sombra</label>
          <select 
            value={shadow} 
            onChange={(e) => setShadow(e.target.value as any)}
            className="px-3 py-2 border rounded"
          >
            <option>sm</option>
            <option>md</option>
            <option>lg</option>
          </select>
        </div>

        <label className="flex items-end gap-2">
          <input 
            type="checkbox" 
            checked={border} 
            onChange={(e) => setBorder(e.target.checked)}
          />
          <span className="text-sm">Com Borda</span>
        </label>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 p-8 rounded-lg">
        <Card shadow={shadow} border={border}>
          <div className="p-6">
            <h3 className="text-lg font-bold mb-2">Título do Card</h3>
            <p className="text-gray-600">
              Conteúdo do card com descrição de um tópico importante.
            </p>
          </div>
        </Card>
      </div>

      {/* Código */}
      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <pre>{`<Card shadow="${shadow}" border={${border}}>
  <div className="p-6">
    <h3>Título</h3>
    <p>Conteúdo...</p>
  </div>
</Card>`}</pre>
      </div>
    </div>
  );
}
```

### Propriedades

| Propriedade | Tipo | Padrão | Descrição |
|------------|------|--------|-----------|
| **shadow** | `'sm' \| 'md' \| 'lg'` | `'md'` | Intensidade da sombra |
| **border** | `boolean` | `true` | Se tem borda |
| **children** | `ReactNode` | — | Conteúdo do card |

---

## Exemplos

### Card Básico

```tsx
<Card>
  <div className="p-6">
    <p>Conteúdo simples</p>
  </div>
</Card>
```

### Card com Header

```tsx
<Card>
  <div className="bg-primary text-white px-6 py-4">
    <h3 className="font-bold">Header</h3>
  </div>
  <div className="p-6">
    <p>Conteúdo do card</p>
  </div>
</Card>
```

### Card com Footer

```tsx
<Card>
  <div className="p-6">
    <p>Conteúdo</p>
  </div>
  <div className="bg-gray-50 px-6 py-3 flex gap-2 justify-end border-t">
    <Button variant="outline" size="sm">Cancelar</Button>
    <Button size="sm">Confirmar</Button>
  </div>
</Card>
```

### Grid de Cards

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {items.map((item) => (
    <Card key={item.id}>
      <div className="p-6">
        <h4 className="font-bold mb-2">{item.title}</h4>
        <p className="text-gray-600">{item.description}</p>
      </div>
    </Card>
  ))}
</div>
```

### Card de Transação

```tsx
<Card>
  <div className="p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <i className="bi bi-arrow-up text-green-600"></i>
        </div>
        <div>
          <p className="font-bold">Depósito</p>
          <p className="text-sm text-gray-600">21 de Abril</p>
        </div>
      </div>
      <p className="font-bold text-green-600">+R$ 1.000,00</p>
    </div>
    <Button fullWidth variant="outline" size="sm">
      Ver Detalhes
    </Button>
  </div>
</Card>
```

---

## Guia de Uso

### Quando Usar

- ✅ Para agrupar conteúdo relacionado
- ✅ Para criar grades de itens
- ✅ Para exibir resumos

### Estrutura

```tsx
<Card>
  {/* Header opcional */}
  <div className="border-b px-6 py-4">
    <h3>Título</h3>
  </div>

  {/* Conteúdo principal */}
  <div className="p-6">
    Conteúdo
  </div>

  {/* Footer opcional */}
  <div className="border-t px-6 py-4 flex gap-2">
    Ações
  </div>
</Card>
```

---

## Acessibilidade

### Semântica

```tsx
<Card role="article" aria-label="Card com informação importante">
  <div>Conteúdo...</div>
</Card>
```

---

**Próximo**: [Modal](../modal)
