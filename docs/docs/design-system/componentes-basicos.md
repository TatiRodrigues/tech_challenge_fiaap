---
sidebar_position: 3
title: Componentes Básicos
description: Button, Input, Card, Badge, Alert
---

# Componentes Básicos

Componentes fundamentais do Design System.

## Button

Disparador de ações.

**Variantes:** Primary, Secondary, Outline
**Tamanhos:** SM, MD, LG
**Estados:** Normal, Hover, Focus, Loading, Disabled

## Input

Campo de entrada de texto.

**Tipos:** Text, Email, Password, Number
**Tamanhos:** SM, MD, LG
**Estados:** Normal, Focus, Error, Disabled

## Card

Contêiner de conteúdo.

**Estrutura:** Header, Body, Footer (opcionais)
**Sombras:** SM, MD, LG
**Opções:** Com/Sem borda

## Badge

Rótulo pequeno.

**Cores:** Primary, Success, Error, Warning
**Tamanhos:** SM, MD, LG

## Alert

Mensagem de alerta.

**Tipos:** Success, Error, Warning, Info
**Opção:** Fechável

---

[Próximo: Componentes Avançados →](./componentes-avancados)
---
sidebar_position: 3
title: Componentes Básicos
description: Botões, inputs, cards e badges
---

# Componentes Básicos

Os componentes básicos são os blocos de construção fundamentais da interface. Eles são simples, reutilizáveis e formam a base de interfaces mais complexas.

## Botões

Botões são elementos interativos para ações do usuário.

### Tipos de Botão

#### Primário
```tsx
<button className="bg-primary text-white px-4 py-2 rounded hover:opacity-90 transition">
  Ação Principal
</button>
```
- Uso: Ações principais, confirmações
- Destaque visual máximo

#### Secundário
```tsx
<button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition">
  Ação Secundária
</button>
```
- Uso: Ações secundárias, alternativas
- Contraste mais suave

#### Fantasma (Outline)
```tsx
<button className="border-2 border-primary text-primary px-4 py-2 rounded hover:bg-primary hover:text-white transition">
  Ação Alterna
</button>
```
- Uso: Ações menos importantes
- Destaque mínimo

### Tamanhos

```tsx
// Small
<button className="px-2 py-1 text-sm rounded bg-primary text-white">
  XS
</button>

// Medium (padrão)
<button className="px-4 py-2 rounded bg-primary text-white">
  SM
</button>

// Large
<button className="px-6 py-3 text-lg rounded bg-primary text-white">
  LG
</button>
```

### Estados

```tsx
// Ativo
<button className="bg-primary text-white px-4 py-2 rounded">
  Ativo
</button>

// Desativado
<button disabled className="bg-gray-300 text-gray-500 px-4 py-2 rounded cursor-not-allowed">
  Desativado
</button>

// Carregando
<button className="bg-primary text-white px-4 py-2 rounded opacity-75">
  <i className="bi bi-hourglass animate-spin mr-2"></i>
  Carregando...
</button>
```

## Inputs

Campos de entrada para coletar dados do usuário.

### Input de Texto

```tsx
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Nome Completo
  </label>
  <input
    type="text"
    placeholder="Digite seu nome"
    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
  />
</div>
```

### Input com Ícone

```tsx
<div className="relative">
  <i className="bi bi-search absolute left-3 top-3 text-gray-400"></i>
  <input
    type="text"
    placeholder="Pesquisar..."
    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded"
  />
</div>
```

### Textarea

```tsx
<label className="block text-sm font-medium text-gray-700 mb-1">
  Mensagem
</label>
<textarea
  rows="4"
  placeholder="Digite sua mensagem..."
  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
></textarea>
```

### Select

```tsx
<select className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary">
  <option>Selecione uma opção</option>
  <option>Opção 1</option>
  <option>Opção 2</option>
</select>
```

## Cards

Cards são contêineres para agrupar conteúdo relacionado.

### Card Básico

```tsx
<div className="bg-white rounded-lg shadow p-4 border border-gray-200">
  <h3 className="text-lg font-bold mb-2">Título do Card</h3>
  <p className="text-gray-600">
    Conteúdo do card com descrição e informações.
  </p>
</div>
```

### Card com Header

```tsx
<div className="bg-white rounded-lg shadow overflow-hidden">
  <div className="bg-primary text-white px-4 py-3">
    <h3 className="font-bold">Header do Card</h3>
  </div>
  <div className="p-4">
    <p className="text-gray-600">Conteúdo principal</p>
  </div>
</div>
```

### Card com Footer

```tsx
<div className="bg-white rounded-lg shadow overflow-hidden">
  <div className="p-4">
    <p className="text-gray-600">Conteúdo do card</p>
  </div>
  <div className="bg-gray-50 px-4 py-3 flex gap-2 justify-end border-t">
    <button className="px-3 py-1 text-sm bg-gray-200 rounded">
      Cancelar
    </button>
    <button className="px-3 py-1 text-sm bg-primary text-white rounded">
      Confirmar
    </button>
  </div>
</div>
```

## Badges

Badges indicam status, categorias ou metadados.

### Cores

```tsx
// Sucesso
<span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
  Ativo
</span>

// Erro
<span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
  Inativo
</span>

// Aviso
<span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
  Pendente
</span>

// Info
<span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
  Novo
</span>
```

### Tamanhos

```tsx
// Pequeno
<span className="bg-primary text-white px-2 py-0.5 rounded text-xs font-medium">
  Badge XS
</span>

// Médio
<span className="bg-primary text-white px-3 py-1 rounded text-sm font-medium">
  Badge SM
</span>

// Grande
<span className="bg-primary text-white px-4 py-2 rounded text-base font-medium">
  Badge LG
</span>
```

## Alertas

Alertas comunicam mensagens importantes ao usuário.

### Alerta de Sucesso

```tsx
<div className="bg-green-50 border border-green-200 rounded-lg p-4">
  <div className="flex gap-3">
    <i className="bi bi-check-circle text-green-600 text-xl"></i>
    <div>
      <h4 className="font-semibold text-green-900">Sucesso!</h4>
      <p className="text-sm text-green-700">Sua ação foi concluída com sucesso.</p>
    </div>
  </div>
</div>
```

### Alerta de Erro

```tsx
<div className="bg-red-50 border border-red-200 rounded-lg p-4">
  <div className="flex gap-3">
    <i className="bi bi-exclamation-circle text-red-600 text-xl"></i>
    <div>
      <h4 className="font-semibold text-red-900">Erro!</h4>
      <p className="text-sm text-red-700">Algo deu errado. Tente novamente.</p>
    </div>
  </div>
</div>
```

### Alerta de Aviso

```tsx
<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
  <div className="flex gap-3">
    <i className="bi bi-exclamation-triangle text-yellow-600 text-xl"></i>
    <div>
      <h4 className="font-semibold text-yellow-900">Aviso</h4>
      <p className="text-sm text-yellow-700">Por favor, revise antes de continuar.</p>
    </div>
  </div>
</div>
```

---

**Próximo**: [Componentes Avançados](./componentes-avancados)
