/**
 * Serviço de Integração com API Bancária
 * Métodos para comunicação com tech-challenge-2 API
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  ILoginRequest,
  IRegisterRequest,
  IAuthResponse,
  IUserResponse,
  IAccountResponse,
  ICreateTransactionRequest,
  IUpdateTransactionRequest,
  ITransactionResponse,
  IStatementResponse,
  IApiError,
} from '@/app/config/api-types';
import { API_CONFIG } from '@/app/config/api';

class BankingApiService {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
    });

    // Interceptor para adicionar token
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Interceptor para tratamento de erros
    this.client.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );

    // Carregar token do localStorage
    this.loadTokenFromStorage();
  }

  private loadTokenFromStorage(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bankingApiToken');
      if (stored) {
        this.token = stored;
      }
    }
  }

  private saveTokenToStorage(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bankingApiToken', token);
    }
    this.token = token;
  }

  private saveUserToStorage(user: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  private clearTokenFromStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bankingApiToken');
    }
    this.token = null;
  }

  private handleError(error: AxiosError): Promise<never> {
    // Extrai mensagem do erro com fallbacks
    let errorMessage: string = 'Erro desconhecido na API';
    
    // Se resposta é HTML, a API não está respondendo corretamente
    if (typeof error.response?.data === 'string' && error.response.data.includes('<!DOCTYPE')) {
      errorMessage = `Erro ${error.response?.status || 'desconhecido'}: API Backend não respondeu corretamente. ` +
        `Verifique se o servidor está rodando em ${error.config?.baseURL}`;
    } else {
      const data = error.response?.data as Record<string, any>;
      errorMessage = 
        data?.message || 
        data?.error ||
        (typeof error.response?.data === 'string' ? error.response.data : null) ||
        error.message || 
        'Erro desconhecido na API';
    }

    const apiError: IApiError = {
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    };

    // Log detalhado para debugging
    console.error(
      `API Error: ${apiError.message} | Status: ${apiError.status} | ` +
      `URL: ${error.config?.url || 'N/A'} | ` +
      `Método: ${error.config?.method?.toUpperCase() || 'N/A'}`
    );

    // Se token expirou (401), limpar token e sugerir re-login
    if (error.response?.status === 401) {
      this.clearTokenFromStorage();
      apiError.message = 'Sessão expirada. Por favor, faça login novamente.';
    }

    // Se servidor não disponível (503, etc)
    if (error.response?.status && error.response.status >= 500) {
      apiError.message = 'Servidor indisponível. Tente novamente mais tarde.';
    }

    return Promise.reject(apiError);
  }

  // ============ AUTENTICAÇÃO ============

  async register(payload: IRegisterRequest): Promise<IUserResponse> {
    const response = await this.client.post<IUserResponse>(
      API_CONFIG.ENDPOINTS.USER_CREATE,
      payload
    );
    
    // Salvar user no localStorage após registro bem-sucedido
    if (response.data.result) {
      this.saveUserToStorage(response.data.result);
    }
    
    return response.data;
  }

  async login(payload: ILoginRequest): Promise<IAuthResponse> {
    const response = await this.client.post<IAuthResponse>(
      API_CONFIG.ENDPOINTS.USER_AUTH,
      payload
    );

    console.log('[banking-api.login] Full response:', response.data);
    console.log('[banking-api.login] response.data.result:', response.data.result);
    console.log('[banking-api.login] response.data.result.user:', response.data.result?.user);
    console.log('[banking-api.login] response.data.result.token:', response.data.result?.token);

    if (response.data.result.token) {
      console.log('[banking-api.login] Saving token to storage');
      this.saveTokenToStorage(response.data.result.token);
    }
    
    if (response.data.result.user) {
      console.log('[banking-api.login] Saving user to storage:', response.data.result.user);
      this.saveUserToStorage(response.data.result.user);
    } else {
      console.log('[banking-api.login] No user in response, user is:', response.data.result.user);
    }

    return response.data;
  }

  async logout(): Promise<void> {
    this.clearTokenFromStorage();
  }

  async sendPasswordReset(email: string): Promise<{ message: string }> {
    try {
      const response = await this.client.post<{ message: string }>(
        '/user/password-reset',
        { email }
      );
      return response.data;
    } catch (error: any) {
      // Se a API não tem esse endpoint, retorna um erro amigável
      // Em produção, isso seria tratado no backend
      console.warn('Endpoint de recuperação de senha não disponível na API');
      throw new Error('Serviço de recuperação de senha indisponível no momento');
    }
  }

  setToken(token: string): void {
    this.saveTokenToStorage(token);
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // ============ CONTAS ============

  async getAccount(): Promise<IAccountResponse> {
    const response = await this.client.get<IAccountResponse>(
      API_CONFIG.ENDPOINTS.ACCOUNT_GET
    );
    return response.data;
  }

  // ============ TRANSAÇÕES ============

  async createTransaction(payload: ICreateTransactionRequest): Promise<ITransactionResponse> {
    const response = await this.client.post<ITransactionResponse>(
      API_CONFIG.ENDPOINTS.ACCOUNT_TRANSACTION,
      payload
    );
    return response.data;
  }

  async updateTransaction(
    transactionId: string,
    payload: IUpdateTransactionRequest
  ): Promise<ITransactionResponse> {
    const url = API_CONFIG.ENDPOINTS.TRANSACTION_UPDATE.replace(
      ':transactionId',
      transactionId
    );
    const response = await this.client.put<ITransactionResponse>(url, payload);
    return response.data;
  }

  async deleteTransaction(transactionId: string): Promise<{ message: string }> {
    const url = API_CONFIG.ENDPOINTS.TRANSACTION_DELETE.replace(
      ':transactionId',
      transactionId
    );
    const response = await this.client.delete<{ message: string }>(url);
    return response.data;
  }

  async getStatement(accountId: string): Promise<IStatementResponse> {
    const url = API_CONFIG.ENDPOINTS.ACCOUNT_STATEMENT.replace(':accountId', accountId);
    const response = await this.client.get<IStatementResponse>(url);
    return response.data;
  }

  // ============ UTILIDADES ============

  async retry<T>(
    fn: () => Promise<T>,
    maxAttempts: number = API_CONFIG.RETRY_ATTEMPTS
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxAttempts) {
          throw error;
        }
        // Aguardar antes de tentar novamente (backoff exponencial)
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
    throw new Error('Max retry attempts reached');
  }
}

// Exportar instância singleton
export const bankingApi = new BankingApiService();
export default BankingApiService;
