---
sidebar_position: 10
title: 🗺️ Mapa Visual
description: Mapa visual de componentes
---

# 🗺️ Mapa Visual de Componentes

Visualização completa de todos os componentes disponíveis.

## Arquitetura de Componentes

```
📦 Componentes Alecrim Finance
│
├─ 📥 Entrada de Dados
│  ├─ Button
│  │  ├─ Variantes: Primary, Secondary, Outline
│  │  ├─ Tamanhos: SM, MD, LG
│  │  └─ Estados: Normal, Hover, Focus, Loading, Disabled
│  │
│  ├─ Input
│  │  ├─ Tipos: Text, Email, Password, Number
│  │  ├─ Tamanhos: SM, MD, LG
│  │  └─ Estados: Normal, Focus, Error, Disabled
│  │
│  └─ Form
│     ├─ FormGroup
│     ├─ FormField
│     └─ Validação em tempo real
│
├─ 📢 Feedback
│  ├─ Alert
│  │  ├─ Tipos: Success, Error, Warning, Info
│  │  └─ Opção: Fechável
│  │
│  └─ Modal
│     ├─ Header, Body, Footer
│     ├─ Tamanhos: SM, MD, LG
│     └─ Estados: Open, Close, Loading
│
├─ 📄 Conteúdo
│  ├─ Card
│  │  ├─ Estrutura: Header, Body, Footer
│  │  ├─ Sombras: SM, MD, LG
│  │  └─ Opção: Com/Sem borda
│  │
│  └─ Table
│     ├─ Cabeçalho, Corpo
│     ├─ Opções: Striped, Bordered, Hoverable
│     └─ Compatível com Paginação
│
```

---

## Mapa de Uso

### Página de Login

```
┌─────────────────────────────────┐
│         ALECRIM FINANCE      │ ← Header
├─────────────────────────────────┤
│                                 │
│  ┌──────────────────────────┐  │
│  │ FAZER LOGIN              │  │ ← Card
│  ├──────────────────────────┤  │
│  │ Email:   [___________]   │  │ ← Input
│  │ Senha:   [___________]   │  │ ← Input
│  │                          │  │
│  │ [Entrar]  [Cadastrar]    │  │ ← Button
│  └──────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

### Página de Transações

```
┌─────────────────────────────────┐
│ 👤 João | Menu ☰               │ ← Header
├─────────────────────────────────┤
│ │                               │
│ │ ┌──────────────────────────┐ │
│ │ │ Saldo: R$ 1.234,00       │ │ ← Card (Resumo)
│ │ └──────────────────────────┘ │
│ │                               │
│ │ [+ Nova Transação]            │ ← Button
│ │                               │
│ │ ┌──────────────────────────┐ │
│ │ │ Data | Descrição | Valor │ │ ← Table
│ │ ├──────────────────────────┤ │
│ │ │ 21/4 | Compra | R$ 50   │ │
│ │ │ 20/4 | Venda  | R$ 100  │ │
│ │ └──────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

### Modal de Confirmação

```
┌──────────────────────────────┐
│ Confirmar Ação           [×] │ ← Modal Header
├──────────────────────────────┤
│                              │
│ Tem certeza que deseja       │
│ deletar esta transação?      │ ← Modal Body
│                              │
│ ┌──────────┐     ┌────────┐  │
│ │ Cancelar │     │ Deletar│  │ ← Button
│ └──────────┘     └────────┘  │ ← Modal Footer
│                              │
└──────────────────────────────┘
```

---

## Fluxo de Uso de Componentes

### Criando uma Nova Transação

```
1. Usuário clica [+ Nova Transação]
   ↓
2. Modal abre com Form
   ├─ Input: Descrição
   ├─ Input: Valor
   ├─ Input: Data
   └─ Button: Salvar
   ↓
3. Validação em tempo real
   ├─ Se erro: Alert exibe mensagem
   └─ Se sucesso: Habilita botão
   ↓
4. Usuário clica Salvar
   ├─ Button entra em estado Loading
   └─ API é chamada
   ↓
5. Resposta da API
   ├─ Se sucesso: Alert success + Modal fecha
   └─ Se erro: Alert error + Modal permanece
```

---

## Matriz de Estados

### Button

| Estado | Aparência | Comportamento |
|--------|-----------|---------------|
| Normal | Cor sólida | Clicável |
| Hover | Cor mais escura | Clicável |
| Focus | Borda de foco | Clicável |
| Active | Comprimido | Clicável |
| Loading | Spinner + texto | Não clicável |
| Disabled | Cinza desabilitado | Não clicável |

### Input

| Estado | Aparência | Validação |
|--------|-----------|-----------|
| Normal | Borda azul | Nenhuma |
| Focus | Borda destacada | Em andamento |
| Valid | Borda verde | ✓ Sucesso |
| Error | Borda vermelha | ✗ Erro |
| Disabled | Cinza | Nenhuma |

### Card

| Tipo | Uso | Exemplo |
|-----|-----|---------|
| Básico | Conteúdo simples | Resumo de valores |
| Com Header | Seção importante | Card de transação |
| Com Footer | Ações | Confirmação |

---

## Guia de Cores

```
🔵 Primary (#0066CC)
   └─ Buttons principais
   └─ Links
   └─ Highlights

🟢 Success (#22C55E)
   └─ Alerts de sucesso
   └─ Status ativo

🔴 Error (#EF4444)
   └─ Alerts de erro
   └─ Validação falha

🟡 Warning (#F59E0B)
   └─ Alerts de aviso

⚫ Neutral (Grays)
   └─ Text
   └─ Backgrounds
   └─ Borders
```

---

## Tamanho de Componentes

```
XSmall | 0.5rem | 8px    │ Badges, Small Tags
Small  | 0.75rem| 12px   │ Small Buttons, Inputs
Medium | 1rem   | 16px   │ Padrão, Buttons, Inputs
Large  | 1.5rem | 24px   │ Large Buttons, Modals
XLarge | 2rem   | 32px   │ Headers, Héros
```

---

## Espaçamento

```
xs │ 0.25rem │  4px │ Muito apertado
sm │ 0.5rem  │  8px │ Compacto
md │ 1rem    │ 16px │ Padrão (mais comum)
lg │ 1.5rem  │ 24px │ Espaçoso
xl │ 2rem    | 32px │ Muito espaçoso
```

---

## Responsive Design

```
📱 Mobile   (< 640px)
   └─ Stack vertical
   └─ Full width buttons
   └─ Cards simples

📱 Tablet   (640px - 1024px)
   └─ 2-3 colunas
   └─ Modals menores
   └─ Tables scrolláveis

🖥️ Desktop  (> 1024px)
   └─ 3+ colunas
   └─ Layout completo
   └─ Modals grandes
```

---

## Checklist de Implementação

Ao usar um componente, verifique:

- [ ] Componente importado corretamente
- [ ] Props passadas com types corretos
- [ ] Label associada (para Input/Form)
- [ ] Callback de evento implementado
- [ ] Estados tratados (loading, error, success)
- [ ] Acessibilidade verificada
- [ ] Responsividade testada
- [ ] Testes unitários escritos

---

**Consulte Também:**
- [Guia Rápido →](./guia-rapido)
- [Melhores Práticas →](./melhores-praticas)
- [Button Documentado →](./button)
