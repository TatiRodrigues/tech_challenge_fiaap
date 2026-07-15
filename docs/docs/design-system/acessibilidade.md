---
sidebar_position: 6
title: Acessibilidade
description: WCAG 2.1 AA — implementações e diretrizes
---

# ♿ Acessibilidade

Conformidade com **WCAG 2.1 nível AA**.

## Implementações (Fase 2)

### Skip Link
```tsx
// app/layout.tsx — antes de qualquer conteúdo
<a href="#main-content" className="skip-link">
  Pular para o conteúdo
</a>
```

### Modais Acessíveis
Todos os modais implementam:
```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-titulo"
  ref={modalRef}
>
  <h2 id="modal-titulo">Título do Modal</h2>
  {/* ... */}
</div>
```

- `role="dialog"` + `aria-modal="true"` — identifica modal para leitores de tela
- `aria-labelledby` — vincula título ao modal
- `ref.focus()` — foco automático ao abrir
- `Escape` — fecha o modal via `useEffect` + `useCallback`
- `role="alert"` — nos erros de validação

### Tabela Acessível
```tsx
<th scope="col">Data</th>
<th scope="col">Descrição</th>
<button aria-label={`Editar: ${transacao.description}`}>
  <i aria-hidden="true" className="bi bi-pencil" />
</button>
```

### Live Regions
```tsx
// Resumo de filtros ativos
<div aria-live="polite">
  Exibindo {count} transações{filterSummary}
</div>
```

### Toggle Buttons
```tsx
<button aria-pressed={viewMode === 'table'}>
  Tabela
</button>
```

### Formulários
```tsx
<label htmlFor="valor">Valor</label>
<input id="valor" aria-describedby="valor-hint" />
<span id="valor-hint">Informe em reais (ex: 100.00)</span>
```

## Checklist WCAG 2.1 AA

| Critério | Status |
|---------|--------|
| 1.1.1 Alternativas de texto | ✅ `aria-label` em ícones e botões |
| 1.4.3 Contraste (mínimo 4.5:1) | ✅ Cores do design system |
| 2.1.1 Teclado | ✅ Todos os elementos acessíveis |
| 2.1.2 Sem armadilha de teclado | ✅ ESC fecha modais |
| 2.4.3 Ordem de foco | ✅ Foco gerenciado nos modais |
| 2.4.7 Foco visível | ✅ Outline em todos os focáveis |
| 3.3.1 Identificação de erro | ✅ `role="alert"` nas mensagens |
| 4.1.2 Nome, função, valor | ✅ ARIA em todos os controles |

## Navegação por Teclado

| Tecla | Ação |
|-------|------|
| `Tab` | Próximo elemento focável |
| `Shift+Tab` | Elemento anterior |
| `Enter` / `Space` | Ativar botão/link |
| `Escape` | Fechar modal |
| `Skip link` | Pular para `#main-content` |

---

[Próximo: Grid & Layout →](./grid-layout)
