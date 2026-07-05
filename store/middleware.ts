/**
 * Redux Middleware Customizado para Logging, Persistência e Analytics
 */

import { Middleware } from '@reduxjs/toolkit';
import { RootState } from './index';

/**
 * Logger Middleware - Registra ações e mudanças de estado
 */
export const loggerMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action: any) => {
    const previousState = store.getState();
    const result = next(action);
    const nextState = store.getState();

    if (process.env.NODE_ENV === 'development') {
      console.group(`[Redux] ${action.type}`);
      console.log('Previous State:', previousState);
      console.log('Action:', action);
      console.log('Next State:', nextState);
      console.groupEnd();
    }

    return result;
  };

/**
 * Persistência Middleware - Salva estado selecionado em localStorage
 */
export const persistenceMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action: any) => {
    const result = next(action);

    // Apenas persistir em client-side
    if (typeof window !== 'undefined') {
      const state = store.getState();

      // Persistir apenas dados essenciais
      const persistData = {
        auth: {
          token: state.auth.token,
          user: state.auth.user,
          isAuthenticated: state.auth.isAuthenticated,
        },
      };

      try {
        localStorage.setItem('redux-persist', JSON.stringify(persistData));
      } catch (error) {
        console.error('Error persisting state:', error);
      }
    }

    return result;
  };

/**
 * Analytics Middleware - Rastreia ações importantes
 */
export const analyticsMiddleware: Middleware<{}, RootState> =
  () => (next) => (action: any) => {
    // Ações importantes para analytics
    const importantActions = [
      'auth/loginUser/fulfilled',
      'auth/registerUser/fulfilled',
      'auth/logout/fulfilled',
      'transactions/addTransaction',
      'transactions/deleteTransaction',
    ];

    if (importantActions.includes(action.type)) {
      const event = {
        type: action.type,
        timestamp: new Date().toISOString(),
        payload: action.payload,
      };

      // Aqui você poderia enviar para um serviço de analytics
      console.log('[Analytics]', event);
    }

    return next(action);
  };

/**
 * Error Handling Middleware - Trata erros globalmente
 */
export const errorHandlingMiddleware: Middleware<{}, RootState> =
  () => (next) => (action: any) => {
    try {
      return next(action);
    } catch (error) {
      console.error('Middleware Error:', error);

      // Dispatch ação de erro global se necessário
      if (action.type.includes('rejected')) {
        console.error(`Failed action: ${action.type}`, action.payload);
      }

      throw error;
    }
  };

/**
 * Debounce Middleware - Evita disparar muitas ações similares
 */
export const createDebouncedMiddleware = (debounceMs: number = 300) => {
  const debounceTimers = new Map<string, NodeJS.Timeout>();

  const debounceMiddleware: Middleware<{}, RootState> =
    () => (next) => (action: any) => {
      const actionKey = `${action.type}:${JSON.stringify(action.payload)}`;

      // Limpar timer anterior se existir
      if (debounceTimers.has(actionKey)) {
        clearTimeout(debounceTimers.get(actionKey)!);
      }

      // Criar novo timer
      const timer = setTimeout(() => {
        next(action);
        debounceTimers.delete(actionKey);
      }, debounceMs);

      debounceTimers.set(actionKey, timer);

      return action;
    };

  return debounceMiddleware;
};

/**
 * Thunk Logging Middleware - Registra execução de thunks
 */
export const thunkLoggingMiddleware: Middleware<{}, RootState> =
  () => (next) => (action: any) => {
    if (action.type?.includes('/pending')) {
      console.log(`⏳ Starting: ${action.type.replace('/pending', '')}`);
    } else if (action.type?.includes('/fulfilled')) {
      console.log(`✅ Success: ${action.type.replace('/fulfilled', '')}`);
    } else if (action.type?.includes('/rejected')) {
      console.error(`❌ Failed: ${action.type.replace('/rejected', '')}`);
    }

    return next(action);
  };
