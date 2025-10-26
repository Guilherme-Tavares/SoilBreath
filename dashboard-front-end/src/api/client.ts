import { API_CONFIG } from './config';

// Tipos de resposta
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
}

// Cliente HTTP base
class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API GET Error:', error);
      throw this.handleError(error);
    }
  }

  // POST request
  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API POST Error:', error);
      throw this.handleError(error);
    }
  }

  // Tratamento de erros
  private handleError(error: any): ApiError {
    if (error.name === 'AbortError') {
      return {
        success: false,
        error: 'TIMEOUT',
        message: 'A requisição demorou muito. Tente novamente.',
      };
    }

    if (!navigator.onLine) {
      return {
        success: false,
        error: 'NO_CONNECTION',
        message: 'Sem conexão com a internet.',
      };
    }

    return {
      success: false,
      error: 'UNKNOWN',
      message: error.message || 'Erro desconhecido ao conectar com o servidor.',
    };
  }
}

// Exportar instância única
export const apiClient = new ApiClient();