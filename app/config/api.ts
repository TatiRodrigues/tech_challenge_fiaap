/**
 * Configuração da API Bancária
 * Integração com tech-challenge-2 API
 */

export const API_CONFIG = {
  // Sempre relativo: o Next.js reescreve /api/bff/* para o backend (server-side).
  // Isso evita que o browser resolva o host do backend diretamente.
  BASE_URL: '/api/bff',
  ENDPOINTS: {
    // Autenticação
    USER_CREATE: '/user',
    USER_AUTH: '/user/auth',

    // Contas
    ACCOUNT_GET: '/account',
    ACCOUNT_TRANSACTION: '/account/transaction',
    ACCOUNT_STATEMENT: '/account/:accountId/statement',

    // Transações (CRUD)
    TRANSACTION_UPDATE: '/account/transaction/:transactionId',
    TRANSACTION_DELETE: '/account/transaction/:transactionId',
  },

  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

export const getApiUrl = (endpoint: string, params?: Record<string, string>): string => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value);
    });
  }

  return url;
};
