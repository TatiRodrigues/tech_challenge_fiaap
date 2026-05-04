---
sidebar_position: 3
title: Input
description: Componente Input - Campo de entrada de texto
---

# Input

O `Input` é um componente para entrada de texto. Suporta múltiplos tipos (text, email, password, number, etc).

## Configurador

Customize o input com as opções abaixo.

### Exemplo Interativo

```tsx
import { Input } from '@/components/ui/Input';

export default function InputConfigurator() {
  const [type, setType] = React.useState<'text' | 'email' | 'password' | 'number'>('text');
  const [size, setSize] = React.useState<'sm' | 'md' | 'lg'>('md');
  const [disabled, setDisabled] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [value, setValue] = React.useState('');

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tipo</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value as any)}
            className="w-full px-3 py-2 border rounded"
          >
            <option>text</option>
            <option>email</option>
            <option>password</option>
            <option>number</option>
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
            checked={error} 
            onChange={(e) => setError(e.target.checked)}
          />
          <span className="text-sm">Erro</span>
        </label>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 p-8 rounded-lg">
        <label className="block text-sm font-medium mb-2">Label do Input</label>
        <Input 
          type={type}
          size={size}
          disabled={disabled}
          error={error}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Digite algo (${type})`}
        />
        {error && (
          <p className="text-sm text-red-600 mt-1">
            Campo obrigatório
          </p>
        )}
      </div>

      {/* Código */}
      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <pre>{`<Input
  type="${type}"
  size="${size}"
  disabled={${disabled}}
  error={${error}}
  placeholder="Digite..."
/>`}</pre>
      </div>
    </div>
  );
}
```

### Propriedades

| Propriedade | Tipo | Descrição |
|------------|------|-----------|
| **type** | `string` | Tipo de input (text, email, password, etc) |
| **size** | `'sm' \| 'md' \| 'lg'` | Tamanho do input |
| **disabled** | `boolean` | Se está desabilitado |
| **error** | `boolean` | Se tem erro |
| **placeholder** | `string` | Texto de placeholder |
| **value** | `string \| number` | Valor do input |
| **onChange** | `(e: ChangeEvent) => void` | Callback de mudança |
| **onBlur** | `(e: FocusEvent) => void` | Callback ao perder foco |
| **onFocus** | `(e: FocusEvent) => void` | Callback ao ganhar foco |

---

## Exemplos

### Tipos de Input

```tsx
<div className="space-y-4">
  <div>
    <label className="block text-sm font-medium mb-1">Texto</label>
    <Input type="text" placeholder="Nome" />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">Email</label>
    <Input type="email" placeholder="seu@email.com" />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">Senha</label>
    <Input type="password" placeholder="••••••••" />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">Número</label>
    <Input type="number" placeholder="0" />
  </div>
</div>
```

### Com Validação

```tsx
const [email, setEmail] = React.useState('');
const [emailError, setEmailError] = React.useState('');

const handleEmailChange = (e) => {
  const value = e.target.value;
  setEmail(value);
  
  if (!value.includes('@')) {
    setEmailError('Email inválido');
  } else {
    setEmailError('');
  }
};

return (
  <div>
    <label>Email</label>
    <Input
      type="email"
      value={email}
      onChange={handleEmailChange}
      error={!!emailError}
    />
    {emailError && (
      <p className="text-sm text-red-600 mt-1">{emailError}</p>
    )}
  </div>
);
```

### Com Ícone

```tsx
<div className="relative">
  <i className="bi bi-search absolute left-3 top-3 text-gray-400"></i>
  <Input
    type="text"
    placeholder="Pesquisar..."
    className="pl-10"
  />
</div>
```

### Com Sufixo

```tsx
<div className="relative">
  <Input
    type="number"
    placeholder="0"
    className="pr-10"
  />
  <span className="absolute right-3 top-3 text-gray-500">R$</span>
</div>
```

---

## Guia de Uso

### Sempre tenha um label

```tsx
✅ Correto
<label htmlFor="name">Nome</label>
<Input id="name" />

❌ Errado
<Input placeholder="Nome" />
```

### Valide em tempo real

```tsx
const [value, setValue] = React.useState('');
const isValid = value.length >= 3;

<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
  error={!isValid && value.length > 0}
/>
```

---

## Acessibilidade

### Label Associada

```tsx
<label htmlFor="email-input">Email</label>
<Input id="email-input" type="email" />
```

### Com Descrição

```tsx
<label htmlFor="password">Senha</label>
<Input 
  id="password" 
  type="password"
  aria-describedby="password-hint"
/>
<p id="password-hint" className="text-sm text-gray-600">
  Mínimo 8 caracteres
</p>
```

---

**Próximo**: [Card](../card)
