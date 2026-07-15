/**
 * Serviço de Verificação de Conectividade
 * Verifica se o servidor da API está acessível
 */

import axios from 'axios';
import { API_CONFIG } from '@/app/config/api';

export interface HealthCheckResult {
  isOnline: boolean;
  baseUrl: string;
  error?: string;
  timestamp: number;
}

class HealthCheckService {
  private lastCheck: HealthCheckResult | null = null;
  private checkInProgress: boolean = false;

  async checkApiHealth(): Promise<HealthCheckResult> {
    // Evitar múltiplas requisições simultâneas
    if (this.checkInProgress) {
      return this.lastCheck || { isOnline: false, baseUrl: API_CONFIG.BASE_URL, error: 'Check em progresso', timestamp: Date.now() };
    }

    this.checkInProgress = true;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout

      const response = await axios.get(`${API_CONFIG.BASE_URL}/health`, {
        signal: controller.signal,
        validateStatus: (status) => status < 500, // Aceita qualquer status < 500
      });

      clearTimeout(timeoutId);

      const result: HealthCheckResult = {
        isOnline: response.status >= 200 && response.status < 400,
        baseUrl: API_CONFIG.BASE_URL,
        timestamp: Date.now(),
      };

      this.lastCheck = result;

      if (!result.isOnline) {
        console.warn(`[HealthCheck] API retornou status ${response.status}`);
      } else {
        console.log('[HealthCheck] API está online ✓');
      }

      return result;
    } catch (error: any) {
      const errorMessage = error.code === 'ECONNREFUSED'
        ? 'Conexão recusada - servidor pode estar desligado'
        : error.message || 'Erro ao verificar conectividade';

      console.warn(`[HealthCheck] API indisponível: ${errorMessage}`);

      const result: HealthCheckResult = {
        isOnline: false,
        baseUrl: API_CONFIG.BASE_URL,
        error: errorMessage,
        timestamp: Date.now(),
      };

      this.lastCheck = result;
      return result;
    } finally {
      this.checkInProgress = false;
    }
  }

  getLastCheck(): HealthCheckResult | null {
    return this.lastCheck;
  }

  isApiOnline(): boolean {
    return this.lastCheck?.isOnline ?? false;
  }
}

// Exportar instância singleton
export const healthCheckService = new HealthCheckService();
export default HealthCheckService;
