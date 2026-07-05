/**
 * Utilitários para Acessibilidade
 * Funções e helpers para garantir conformidade WCAG 2.1
 */

/**
 * Cria atributos ARIA para botões com comportamento especial
 */
export const createAriaButton = (options: {
  label: string;
  pressed?: boolean;
  disabled?: boolean;
  expanded?: boolean;
  controls?: string;
  describedBy?: string;
}) => ({
  role: "button",
  "aria-label": options.label,
  ...(options.pressed !== undefined && { "aria-pressed": options.pressed }),
  ...(options.disabled && { "aria-disabled": true }),
  ...(options.expanded !== undefined && { "aria-expanded": options.expanded }),
  ...(options.controls && { "aria-controls": options.controls }),
  ...(options.describedBy && { "aria-describedby": options.describedBy }),
  tabIndex: options.disabled ? -1 : 0,
});

/**
 * Cria atributos para elementos com live regions (ARIA Live)
 */
export const createAriaLive = (type: "polite" | "assertive" = "polite") => ({
  "aria-live": type,
  "aria-atomic": true,
});

/**
 * Cria atributos para alertas acessíveis
 */
export const createAriaAlert = (type: "success" | "error" | "warning" | "info") => ({
  role: "alert",
  "aria-live": type === "error" ? "assertive" : "polite",
  "aria-atomic": true,
});

/**
 * Gerencia focus para acessibilidade de teclado
 */
export const manageFocus = {
  /**
   * Move o focus para um elemento
   */
  setFocus: (elementId: string | HTMLElement) => {
    const element =
      typeof elementId === "string"
        ? document.getElementById(elementId)
        : elementId;
    if (element instanceof HTMLElement) {
      element.focus();
    }
  },

  /**
   * Captura focus em um container (modal-like behavior)
   */
  trap: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    return {
      first: firstElement,
      last: lastElement,
      all: Array.from(focusableElements) as HTMLElement[],
    };
  },

  /**
   * Restaura focus para o elemento anterior
   */
  restore: (previousElement: HTMLElement) => {
    setTimeout(() => {
      if (previousElement instanceof HTMLElement) {
        previousElement.focus();
      }
    }, 0);
  },
};

/**
 * Utilitários para navegação por teclado
 */
export const keyboardNavigation = {
  /**
   * Detecta teclas de navegação comuns
   */
  isNavigationKey: (event: KeyboardEvent) => {
    const key = event.key;
    return ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Tab"].includes(
      key
    );
  },

  /**
   * Detecta tecla Escape
   */
  isEscapeKey: (event: KeyboardEvent) => event.key === "Escape",

  /**
   * Detecta tecla Enter
   */
  isEnterKey: (event: KeyboardEvent) => event.key === "Enter",

  /**
   * Detecta tecla Space
   */
  isSpaceKey: (event: KeyboardEvent) => event.key === " ",

  /**
   * Detecta teclas de ativação (Enter ou Space)
   */
  isActivationKey: (event: KeyboardEvent) => {
    return (
      event.key === "Enter" ||
      event.key === " " ||
      event.keyCode === 13 ||
      event.keyCode === 32
    );
  },

  /**
   * Impede scroll ao pressionar Space
   */
  preventSpaceScroll: (event: KeyboardEvent) => {
    if (keyboardNavigation.isSpaceKey(event)) {
      event.preventDefault();
    }
  },
};

/**
 * Utilitários para leitores de tela
 */
export const screenReaderAnnouncements = {
  /**
   * Cria uma região live para anúncios ao leitor de tela
   */
  createLiveRegion: (id: string, type: "polite" | "assertive" = "polite") => {
    const region = document.createElement("div");
    region.id = id;
    region.setAttribute("aria-live", type);
    region.setAttribute("aria-atomic", "true");
    region.className = "sr-only"; // Classe para esconder visualmente mas não para leitores
    return region;
  },

  /**
   * Anuncia mensagem ao leitor de tela
   */
  announce: (message: string, id = "sr-announcements") => {
    let region = document.getElementById(id);
    if (!region) {
      region = screenReaderAnnouncements.createLiveRegion(id);
      document.body.appendChild(region);
    }
    region.textContent = message;
  },

  /**
   * Classe CSS para esconder visualmente mas manter para leitores
   */
  srOnlyClass: "sr-only",
};

/**
 * Utilitários para contraste e cores
 */
export const contrastUtilities = {
  /**
   * Calcula o contraste de cores (WCAG)
   */
  getContrast: (foreground: string, background: string): number => {
    const getLuminance = (color: string) => {
      const rgb = parseInt(color.substring(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      const luminance =
        (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance <= 0.03928
        ? luminance / 12.92
        : Math.pow((luminance + 0.055) / 1.055, 2.4);
    };

    const l1 = getLuminance(foreground);
    const l2 = getLuminance(background);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
  },

  /**
   * Verifica se o contraste é adequado para WCAG AA (4.5:1 para texto)
   */
  isAccessibleContrast: (foreground: string, background: string): boolean => {
    return contrastUtilities.getContrast(foreground, background) >= 4.5;
  },
};

/**
 * Utilitários para skip links (pular navegação)
 */
export const skipLinks = {
  /**
   * Cria um skip link para pular para o conteúdo principal
   */
  createSkipLink: (mainContentId = "main-content") => {
    const skipLink = document.createElement("a");
    skipLink.href = `#${mainContentId}`;
    skipLink.textContent = "Pular para o conteúdo principal";
    skipLink.className =
      "skip-link visually-hidden-focusable d-inline-focus";
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 0;
      background: #000;
      color: #fff;
      padding: 8px;
      z-index: 100;
    `;
    return skipLink;
  },

  /**
   * CSS para mostrar skip link ao focar
   */
  skipLinkCss: `
    .skip-link:focus {
      top: 0;
    }
  `,
};

/**
 * Composição: criar props acessíveis para componentes comuns
 */
export const createAccessibleProps = {
  /**
   * Para inputs de formulário
   */
  input: (options: {
    id: string;
    label?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
  }) => ({
    id: options.id,
    "aria-label": options.label,
    "aria-required": options.required,
    "aria-disabled": options.disabled,
    "aria-describedby": options.error ? `error-${options.id}` : undefined,
  }),

  /**
   * Para links
   */
  link: (options: { label?: string; current?: boolean }) => ({
    "aria-label": options.label,
    "aria-current": options.current ? "page" : undefined,
  }),

  /**
   * Para campos de busca
   */
  searchInput: (options: { id: string; resultsId?: string }) => ({
    type: "search",
    id: options.id,
    role: "searchbox",
    "aria-label": "Buscar",
    "aria-controls": options.resultsId,
  }),

  /**
   * Para abas (tabs)
   */
  tabPanel: (options: {
    tabId: string;
    label: string;
  }) => ({
    role: "tabpanel",
    "aria-labelledby": options.tabId,
  }),
};
