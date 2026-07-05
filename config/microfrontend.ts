/**
 * Configuração para Microfrontends com Module Federation
 * Permite a divisão da aplicação em módulos independentes
 * 
 * Este arquivo pode ser integrado no next.config.ts usando plugin
 */

export interface MicroFrontendConfig {
  name: string;
  filename: string;
  exposes: Record<string, string>;
  shared: Record<string, SharedLibraryConfig>;
}

export interface SharedLibraryConfig {
  singleton: boolean;
  eager: boolean;
  requiredVersion: string;
  strictVersion: boolean;
}

/**
 * Configuração para Host (aplicação principal)
 */
export const hostConfig: MicroFrontendConfig = {
  name: "alecrim_wallet_host",
  filename: "static/chunks/remoteEntry.js",
  exposes: {
    "./components/Header": "./componentes/header/Header.tsx",
    "./components/MenuLateral": "./componentes/menu-lateral/MenuLateral.tsx",
    "./components/Rodape": "./componentes/rodape/Rodape.tsx",
    "./hooks/useAuth": "./hooks/useAuth.ts",
    "./hooks/useTransactions": "./hooks/useTransactions/index.tsx",
    "./types": "./types/index.ts",
  },
  shared: {
    react: {
      singleton: true,
      eager: true,
      requiredVersion: "19.2.3",
      strictVersion: true,
    },
    "react-dom": {
      singleton: true,
      eager: true,
      requiredVersion: "19.2.3",
      strictVersion: true,
    },
    "react-redux": {
      singleton: true,
      eager: false,
      requiredVersion: "^9.0.0",
      strictVersion: false,
    },
    "@reduxjs/toolkit": {
      singleton: true,
      eager: false,
      requiredVersion: "^2.0.0",
      strictVersion: false,
    },
    bootstrap: {
      singleton: true,
      eager: false,
      requiredVersion: "^5.3.8",
      strictVersion: false,
    },
  },
};

/**
 * Configuração para Microfrontend 1: Transações
 * Remote para servir funcionalidades de transações
 */
export const transactionsMicroFrontendConfig: MicroFrontendConfig = {
  name: "alecrim_wallet_transactions",
  filename: "static/chunks/remoteEntry.js",
  exposes: {
    "./components/ListarTransacoes": "./componentes/features/listar-transacoes/page.tsx",
    "./components/NovaTransacao": "./componentes/features/formulario-transacao/page.tsx",
    "./components/ResumoTransacao": "./componentes/features/resumo-transacao/page.tsx",
    "./components/ModalEditarTransacao": "./componentes/features/modal-editar-transacao/index.tsx",
    "./components/CardsResumo": "./componentes/features/cards-resumo/page.tsx",
    "./types/transaction": "./types/index.ts",
    "./store/transactions": "./store/slices/transactionsSlice.ts",
  },
  shared: {
    react: {
      singleton: true,
      eager: false,
      requiredVersion: "19.2.3",
      strictVersion: true,
    },
    "react-dom": {
      singleton: true,
      eager: false,
      requiredVersion: "19.2.3",
      strictVersion: true,
    },
    "react-redux": {
      singleton: true,
      eager: false,
      requiredVersion: "^9.0.0",
      strictVersion: false,
    },
    "@reduxjs/toolkit": {
      singleton: true,
      eager: false,
      requiredVersion: "^2.0.0",
      strictVersion: false,
    },
  },
};

/**
 * Configuração para Microfrontend 2: Autenticação
 * Remote para servir funcionalidades de autenticação
 */
export const authMicroFrontendConfig: MicroFrontendConfig = {
  name: "alecrim_wallet_auth",
  filename: "static/chunks/remoteEntry.js",
  exposes: {
    "./components/Login": "./app/login/page.tsx",
    "./components/Cadastro": "./app/cadastro/page.tsx",
    "./components/EsqueceuSenha": "./app/esqueceu-senha/page.tsx",
    "./hooks/useAuth": "./hooks/useProtectedRoute.ts",
    "./store/auth": "./store/slices/authSlice.ts",
    "./services/auth": "./app/servicos/auth.ts",
  },
  shared: {
    react: {
      singleton: true,
      eager: false,
      requiredVersion: "19.2.3",
      strictVersion: true,
    },
    "react-dom": {
      singleton: true,
      eager: false,
      requiredVersion: "19.2.3",
      strictVersion: true,
    },
    "react-redux": {
      singleton: true,
      eager: false,
      requiredVersion: "^9.0.0",
      strictVersion: false,
    },
  },
};

/**
 * Consumidor remoto - configuração para aplicação que consome os microfrontends
 */
export const createRemoteConfig = (remotes: Record<string, string>) => ({
  remotes,
  shared: {
    react: {
      singleton: true,
      requiredVersion: "19.2.3",
      strictVersion: true,
    },
    "react-dom": {
      singleton: true,
      requiredVersion: "19.2.3",
      strictVersion: true,
    },
    "react-redux": {
      singleton: true,
      eager: false,
      requiredVersion: "^9.0.0",
      strictVersion: false,
    },
  },
});

/**
 * Exemplo de aplicação remota: http://localhost:3001/remoteEntry.js
 * Pode ser usado como referência ao integrar outros microfrontends
 */
export const externalMicroFrontends = {
  transactions: "alecrim_wallet_transactions@http://localhost:3001/remoteEntry.js",
  auth: "alecrim_wallet_auth@http://localhost:3002/remoteEntry.js",
  reporting: "alecrim_wallet_reporting@http://localhost:3003/remoteEntry.js",
};

/**
 * Wrapper para carregar dinamicamente componentes remotos
 * Uso: const Component = await loadRemoteComponent("transactions", "./components/ListarTransacoes");
 */
/**
 * @deprecated Webpack Module Federation não é suportado por Turbopack (bundler padrão do Next.js 16)
 * Esta função é mantida apenas para referência histórica
 * Para usar microfrontends com Next.js 16, considere usar:
 * - Dynamic imports com next/dynamic
 * - Routes dinâmicas
 * - Shared Redux store via props
 */
export const loadRemoteComponent = async (
  scope: string,
  module: string,
  shareScope: string = "default"
) => {
  throw new Error(
    `Webpack Module Federation não é suportado em Turbopack.\n` +
    `Para carregar componentes remotos, use dynamic imports ou routes dinâmicas.\n` +
    `Escopo: ${scope}, Módulo: ${module}, ShareScope: ${shareScope}`
  );
};

/**
 * Estratégia de Comunicação entre Microfrontends
 * Usar event emitter ou pub/sub para comunicação desacoplada
 */
export class MicroFrontendBus {
  private static listeners: Map<string, Set<Function>> = new Map();

  static subscribe(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => {
      this.listeners.get(event)!.delete(callback);
    };
  }

  static emit(event: string, data: any) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach((callback) => callback(data));
    }
  }

  static clear() {
    this.listeners.clear();
  }
}

/**
 * Exemplo de uso:
 * 
 * // Publicador (Microfrontend A)
 * MicroFrontendBus.emit('transaction:created', { id: '123', valor: 1000 });
 * 
 * // Assinante (Microfrontend B)
 * const unsubscribe = MicroFrontendBus.subscribe('transaction:created', (data) => {
 *   console.log('Nova transação criada:', data);
 * });
 * 
 * // Desinscrever
 * unsubscribe();
 */

export default {
  hostConfig,
  transactionsMicroFrontendConfig,
  authMicroFrontendConfig,
  createRemoteConfig,
  externalMicroFrontends,
  loadRemoteComponent,
  MicroFrontendBus,
};
