/** @jsx React.createElement */
/**
 * Acessibilidade Avançada - Componentes e Hooks WCAG 2.1 Level AA
 * Complementa accessibility.ts com componentes React prontos para uso
 */

import React, { useCallback, useEffect, useRef } from 'react';

// ============ ARIA LABELS AVANÇADOS ============

export const ADVANCED_ARIA_LABELS = {
  // Navegação
  MAIN_NAVIGATION: 'Navegação principal',
  SIDEBAR: 'Menu lateral',
  BREADCRUMB: 'Trilha de navegação',
  PAGINATION: 'Paginação',
  SKIP_TO_MAIN: 'Pular para conteúdo principal',

  // Transações
  TRANSACTION_LIST: 'Lista de transações',
  TRANSACTION_FILTERS: 'Filtros de transações',
  ADD_TRANSACTION: 'Adicionar nova transação',
  EDIT_TRANSACTION: 'Editar transação',
  DELETE_TRANSACTION: 'Deletar transação',

  // Dashboard
  FINANCIAL_DASHBOARD: 'Painel financeiro',
  INCOME_CHART: 'Gráfico de receitas',
  EXPENSE_CHART: 'Gráfico de despesas',
  SUMMARY_CARDS: 'Resumo financeiro',

  // Formulários
  FORM_ERRORS: 'Erros do formulário',
  FORM_SUCCESS: 'Formulário enviado com sucesso',
  REQUIRED_FIELD_MARKER: 'Campo obrigatório',

  // Ações comuns
  CLOSE_MODAL: 'Fechar diálogo',
  OPEN_MENU: 'Abrir menu',
  LOAD_MORE: 'Carregar mais',
  SORT_ASCENDING: 'Ordenar em ordem crescente',
  SORT_DESCENDING: 'Ordenar em ordem decrescente',
} as const;

// ============ KEYBOARD SHORTCUTS AVANÇADOS ============

export const ADVANCED_KEYBOARD_SHORTCUTS = {
  // Navegação global
  FOCUS_SEARCH: 'Ctrl+K',
  FOCUS_MAIN: 'Ctrl+1',
  FOCUS_SIDEBAR: 'Ctrl+2',
  FOCUS_FOOTER: 'Ctrl+0',

  // Transações
  NEW_TRANSACTION: 'Ctrl+N',
  EDIT_TRANSACTION: 'Ctrl+E',
  DELETE_TRANSACTION: 'Delete',
  FILTER_TRANSACTIONS: 'Ctrl+F',

  // Navegação de página
  NEXT_PAGE: 'PageDown',
  PREV_PAGE: 'PageUp',
  FIRST_PAGE: 'Home',
  LAST_PAGE: 'End',

  // Misc
  CLOSE_MODAL: 'Escape',
  HELP: '?',
} as const;

// ============ HOOKS AVANÇADOS ============

/**
 * Hook para gerenciar navegação por teclado em menus
 */
export function useMenuKeyboardNavigation(
  itemsCount: number,
  onSelect?: (index: number) => void,
  onEscape?: () => void
) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      let newIndex = activeIndex;
      let preventDefault = false;

      switch (event.key) {
        case 'ArrowDown':
          newIndex = (activeIndex + 1) % itemsCount;
          preventDefault = true;
          break;

        case 'ArrowUp':
          newIndex = (activeIndex - 1 + itemsCount) % itemsCount;
          preventDefault = true;
          break;

        case 'Home':
          newIndex = 0;
          preventDefault = true;
          break;

        case 'End':
          newIndex = itemsCount - 1;
          preventDefault = true;
          break;

        case 'Enter':
        case ' ':
          onSelect?.(activeIndex);
          preventDefault = true;
          break;

        case 'Escape':
          onEscape?.();
          preventDefault = true;
          break;

        default:
          return;
      }

      if (preventDefault) {
        event.preventDefault();
      }

      setActiveIndex(newIndex);
    },
    [activeIndex, itemsCount, onSelect, onEscape]
  );

  // Auto-focus quando índice muda
  useEffect(() => {
    if (!menuRef.current) return;

    const items = menuRef.current.querySelectorAll('[role="menuitem"]');
    if (items[activeIndex]) {
      (items[activeIndex] as HTMLElement).focus();
    }
  }, [activeIndex]);

  return { activeIndex, setActiveIndex, handleKeyDown, menuRef };
}

/**
 * Hook para anunciar mudanças para screen readers com delay
 */
export function useAccessibleAnnouncement() {
  const announcerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const announce = (
    message: string,
    priority: 'polite' | 'assertive' = 'polite',
    delayMs: number = 100
  ) => {
    if (!announcerRef.current) return;

    // Limpar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    announcerRef.current.setAttribute('aria-live', priority);
    announcerRef.current.setAttribute('aria-atomic', 'true');

    // Adicionar delay para garantir que o leitor de tela pegue a mudança
    timeoutRef.current = setTimeout(() => {
      if (announcerRef.current) {
        announcerRef.current.textContent = message;

        // Limpar após o anúncio
        setTimeout(() => {
          if (announcerRef.current) {
            announcerRef.current.textContent = '';
          }
        }, 1000);
      }
    }, delayMs);
  };

  const Announcer = () => (
    <div
      ref={announcerRef}
      role="status"
      className="sr-only"
      aria-live="polite"
      aria-atomic="true"
    />
  );

  return { announce, Announcer };
}

/**
 * Hook para gerenciar focus em listas virtualizadas
 */
export function useVirtualListA11y(
  itemCount: number,
  itemHeight: number,
  containerHeight: number
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = React.useState(0);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, index: number) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex(Math.min(index + 1, itemCount - 1));
          break;

        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex(Math.max(index - 1, 0));
          break;

        case 'PageDown':
          event.preventDefault();
          const itemsPerPage = Math.floor(containerHeight / itemHeight);
          setFocusedIndex(Math.min(index + itemsPerPage, itemCount - 1));
          break;

        case 'PageUp':
          event.preventDefault();
          const itemsPerPageUp = Math.floor(containerHeight / itemHeight);
          setFocusedIndex(Math.max(index - itemsPerPageUp, 0));
          break;

        case 'Home':
          event.preventDefault();
          setFocusedIndex(0);
          break;

        case 'End':
          event.preventDefault();
          setFocusedIndex(itemCount - 1);
          break;

        default:
          break;
      }
    },
    [itemCount, itemHeight, containerHeight]
  );

  // Scroll para o item focado
  useEffect(() => {
    if (!containerRef.current) return;

    const scrollPosition = focusedIndex * itemHeight;
    const containerScroll = containerRef.current.scrollTop;
    const containerBottom = containerScroll + containerHeight;

    if (scrollPosition < containerScroll) {
      containerRef.current.scrollTop = scrollPosition;
    } else if (scrollPosition + itemHeight > containerBottom) {
      containerRef.current.scrollTop = scrollPosition + itemHeight - containerHeight;
    }
  }, [focusedIndex, itemHeight, containerHeight]);

  return { containerRef, focusedIndex, handleKeyDown };
}

/**
 * Hook para gerenciar diálogos modais com acessibilidade
 */
export function useAccessibleModal(onClose: () => void) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Salvar foco anterior
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus trap
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }

      if (event.key === 'Tab') {
        const focusable = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (!focusable || focusable.length === 0) return;

        const first = focusable[0] as HTMLElement;
        const last = focusable[focusable.length - 1] as HTMLElement;

        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    };

    // Auto-focus no primeiro elemento focável
    setTimeout(() => {
      const firstFocusable = modalRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      firstFocusable?.focus();
    }, 100);

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Restaurar foco
      previousFocusRef.current?.focus();
    };
  }, [onClose]);

  return { modalRef, isOpen: !!modalRef.current };
}

/**
 * Hook para páginas/seções com heading e skip links
 */
export function usePageHeading(title: string, level: 1 | 2 | 3 | 4 | 5 | 6 = 1) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div>
      <a href="#main-content" className="skip-link">
        {ADVANCED_ARIA_LABELS.SKIP_TO_MAIN}
      </a>
      {React.createElement(`h${level}`, { id: 'page-title' }, title)}
    </div>
  );
}

// ============ COMPONENTES ACESSÍVEIS ============

/**
 * Data Table acessível com suporte a ordenação
 */
export interface AccessibleTableProps {
  columns: Array<{
    key: string;
    label: string;
    sortable?: boolean;
  }>;
  rows: Array<Record<string, any>>;
  rowId: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
  caption?: string;
}

export const AccessibleTable: React.FC<AccessibleTableProps> = ({
  columns,
  rows,
  rowId,
  sortBy,
  sortDirection,
  onSort,
  caption,
}) => {
  return (
    <div className="table-wrapper">
      <table role="table" aria-label={caption}>
        {caption && <caption>{caption}</caption>}

        <thead>
          <tr role="row">
            {columns.map((col) => (
              <th
                key={col.key}
                role="columnheader"
                aria-sort={
                  sortBy === col.key
                    ? sortDirection === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                }
              >
                {col.sortable ? (
                  <button
                    onClick={() => onSort?.(col.key)}
                    aria-label={`${col.label}, ${sortBy === col.key ? `classificado ${sortDirection}` : 'não classificado'}`}
                  >
                    {col.label}
                    {sortBy === col.key && (
                      <span aria-hidden="true">
                        {sortDirection === 'asc' ? '▼' : '▲'}
                      </span>
                    )}
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, idx) => (
            <tr key={row[rowId] || idx} role="row">
              {columns.map((col) => (
                <td
                  key={`${row[rowId]}-${col.key}`}
                  role="gridcell"
                  data-label={col.label}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ============ CSS CLASSES PARA ACESSIBILIDADE ============

export const A11Y_CSS = `
/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Skip links */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: white;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}

/* Focus visible para navegação por teclado */
:focus-visible {
  outline: 3px solid #4A90E2;
  outline-offset: 2px;
}

/* Contraste mínimo para botões */
button, input[type="button"], input[type="submit"] {
  min-height: 44px;
  min-width: 44px;
}

/* Alternar para modo de alto contraste */
@media (prefers-contrast: more) {
  body {
    background-color: #000;
    color: #FFF;
  }
}

/* Respeitar preferência de movimento reduzido */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
`;

export default {
  ADVANCED_ARIA_LABELS,
  ADVANCED_KEYBOARD_SHORTCUTS,
  useMenuKeyboardNavigation,
  useAccessibleAnnouncement,
  useVirtualListA11y,
  useAccessibleModal,
  usePageHeading,
  AccessibleTable,
  A11Y_CSS,
};
