/**
 * Estratégia Avançada de Comunicação entre Microfrontends
 * Implementa padrão de Event Bus com tipagem forte
 */

export interface MicrofrontendEvent {
  source: string;
  target: string;
  type: string;
  payload?: any;
  timestamp: number;
}

/**
 * Bus centralizado para comunicação entre microfrontends
 * Implementa padrão Observer com suporte a requisições síncronas
 */
export class MicrofrontendBus {
  private static instance: MicrofrontendBus;
  private listeners: Map<string, Set<(event: MicrofrontendEvent) => void>> = new Map();
  private requestHandlers: Map<string, (payload: any) => Promise<any>> = new Map();

  private constructor() {
    // Listener para eventos do localStorage (comunicação cross-tab)
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === 'mfe-event') {
          try {
            const mfeEvent = JSON.parse(event.newValue || '{}') as MicrofrontendEvent;
            this.emitLocal(mfeEvent);
          } catch (error) {
            console.error('Error parsing MFE event from storage:', error);
          }
        }
      });

      // Listener para custom events (comunicação dentro da aba)
      window.addEventListener('microfrontend-event', (event: any) => {
        this.emitLocal(event.detail as MicrofrontendEvent);
      });
    }
  }

  static getInstance(): MicrofrontendBus {
    if (!MicrofrontendBus.instance) {
      MicrofrontendBus.instance = new MicrofrontendBus();
    }
    return MicrofrontendBus.instance;
  }

  /**
   * Emitir evento globalmente
   */
  emit(event: MicrofrontendEvent): void {
    if (typeof window !== 'undefined') {
      // Enviar para custom event listeners
      window.dispatchEvent(
        new CustomEvent('microfrontend-event', { detail: event })
      );

      // Persistir em localStorage para cross-tab communication
      try {
        localStorage.setItem('mfe-event', JSON.stringify(event));
      } catch (error) {
        console.warn('Cannot persist MFE event to storage:', error);
      }
    }

    // Executar listeners locais
    this.emitLocal(event);
  }

  private emitLocal(event: MicrofrontendEvent): void {
    const listeners = this.listeners.get(event.type) || new Set();
    listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error(`Error in listener for ${event.type}:`, error);
      }
    });
  }

  /**
   * Registrar listener para eventos
   */
  on(
    eventType: string,
    callback: (event: MicrofrontendEvent) => void
  ): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }

    this.listeners.get(eventType)!.add(callback);

    // Retornar função para unsubscribe
    return () => {
      this.listeners.get(eventType)?.delete(callback);
    };
  }

  /**
   * Registrar listener para um único evento
   */
  once(
    eventType: string,
    callback: (event: MicrofrontendEvent) => void
  ): () => void {
    const unsubscribe = this.on(eventType, (event) => {
      callback(event);
      unsubscribe();
    });
    return unsubscribe;
  }

  /**
   * Registrar handler para requisições de outro MFE
   */
  handle(
    eventType: string,
    handler: (payload: any) => Promise<any>
  ): () => void {
    this.requestHandlers.set(eventType, handler);

    return () => {
      this.requestHandlers.delete(eventType);
    };
  }

  /**
   * Fazer requisição síncrona para outro MFE
   */
  async request<T = any>(
    source: string,
    target: string,
    type: string,
    payload?: any,
    timeoutMs: number = 5000
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const requestId = `${type}:${Date.now()}:${Math.random()}`;
      
      const timeout = setTimeout(() => {
        unsubscribe();
        reject(new Error(`MFE Request timeout: ${source} → ${target}:${type}`));
      }, timeoutMs);

      const unsubscribe = this.once(`${requestId}:response`, (event) => {
        clearTimeout(timeout);
        if (event.payload?.error) {
          reject(new Error(event.payload.error));
        } else {
          resolve(event.payload?.data);
        }
      });

      this.emit({
        source,
        target,
        type: `${requestId}:request`,
        payload,
        timestamp: Date.now(),
      });
    });
  }

  /**
   * Responder a uma requisição
   */
  respond(
    requestId: string,
    source: string,
    data: any,
    error?: string
  ): void {
    this.emit({
      source: 'self',
      target: source,
      type: `${requestId}:response`,
      payload: {
        data,
        error,
      },
      timestamp: Date.now(),
    });
  }

  /**
   * Limpar todos os listeners (útil em testes)
   */
  clear(): void {
    this.listeners.clear();
    this.requestHandlers.clear();
  }
}

/**
 * Hook para usar o Bus em componentes React
 */
export function useMicrofrontendBus(mfeName: string) {
  const bus = MicrofrontendBus.getInstance();

  return {
    emit: (type: string, payload?: any) =>
      bus.emit({
        source: mfeName,
        target: 'broadcast',
        type,
        payload,
        timestamp: Date.now(),
      }),

    on: (type: string, callback: (payload: any) => void) =>
      bus.on(type, (event) => callback(event.payload)),

    request: <T = any>(target: string, type: string, payload?: any) =>
      bus.request<T>(mfeName, target, type, payload),

    handle: (type: string, handler: (payload: any) => Promise<any>) =>
      bus.handle(type, handler),
  };
}

/**
 * Tipos de eventos padrão entre MFEs
 */
export namespace MFEEvents {
  export const AUTH_LOGIN = 'auth:login';
  export const AUTH_LOGOUT = 'auth:logout';
  export const AUTH_TOKEN_REFRESH = 'auth:token:refresh';

  export const TRANSACTION_CREATED = 'transaction:created';
  export const TRANSACTION_UPDATED = 'transaction:updated';
  export const TRANSACTION_DELETED = 'transaction:deleted';

  export const NAVIGATION_CHANGED = 'navigation:changed';
  export const THEME_CHANGED = 'theme:changed';
  export const NOTIFICATION_SHOW = 'notification:show';
}

/**
 * Contexto global compartilhado entre MFEs
 */
export interface MFEContext {
  currentUser?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  theme?: 'light' | 'dark';
  locale?: string;
  token?: string;
}

/**
 * State management compartilhado
 */
export class SharedStateManager {
  private state: MFEContext = {};
  private listeners: Set<(state: MFEContext) => void> = new Set();

  setState(updates: Partial<MFEContext>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  getState(): MFEContext {
    return this.state;
  }

  subscribe(listener: (state: MFEContext) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }
}

/**
 * Loader para componentes remotos (lazy loading de MFEs)
 */
export async function loadRemoteModule<T = any>(
  scope: string,
  module: string
): Promise<T> {
  try {
    // Compartilhamento de container (webpack/module federation)
    const container = (window as any)[scope];

    if (!container) {
      throw new Error(`Module federation container "${scope}" not found`);
    }

    // Inicializar container
    await container.init((window as any).__webpack_share_scopes__ || {});

    // Obter factory do módulo
    const factory = await container.get(module);
    const Module = factory();

    return Module.default || Module;
  } catch (error) {
    console.error(`Error loading remote module ${scope}/${module}:`, error);
    throw error;
  }
}

/**
 * Error boundary para componentes remotos
 */
export class RemoteComponentErrorBoundary extends Error {
  constructor(scope: string, module: string) {
    super(`Failed to load remote component: ${scope}/${module}`);
    this.name = 'RemoteComponentError';
  }
}

export default {
  MicrofrontendBus,
  MFEEvents,
  SharedStateManager,
};
