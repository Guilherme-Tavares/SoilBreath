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
  private token: string | null = null;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  // Definir token de autenticação
  setToken(token: string | null) {
    this.token = token;
  }

  // Obter headers com ou sem autenticação
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Tentar ler mensagem de erro da API
        let errorMessage = `HTTP Error: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // Se não conseguir parsear JSON, manter mensagem padrão
        }
        throw new Error(errorMessage);
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
        headers: this.getHeaders(),
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Tentar ler mensagem de erro da API
        let errorMessage = `HTTP Error: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // Se não conseguir parsear JSON, manter mensagem padrão
        }
        throw new Error(errorMessage);
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