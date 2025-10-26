import { apiClient, ApiResponse } from '../client';
import { API_ENDPOINTS } from '../config';

// ✅ Baseado no modelo C# "Solo"
export interface Solo {
  id: number;
  identificacao: string;
  nitrogenio: number;
  fosforo: number;
  potassio: number;
  culturaId: number;
  propriedadeId: number;
  // Relacionamentos (opcional)
  cultura?: Cultura;
}

// ✅ Baseado no modelo C# "Cultura"
export interface Cultura {
  id: number;
  nome: string;
  nitrogenio: number;  // Valores ideais
  fosforo: number;
  potassio: number;
}

// Para criar/atualizar solo
export interface SoloCreateDTO {
  identificacao: string;
  nitrogenio: number;
  fosforo: number;
  potassio: number;
  idCultura: number;
  idPropriedade: number;
}

// Serviço de Solo
export const soloService = {
  // Buscar todos os solos de uma propriedade
  async getSolos(idPropriedade: number): Promise<ApiResponse<Solo[]>> {
    return apiClient.get<Solo[]>(`${API_ENDPOINTS.SOLOS}?idPropriedade=${idPropriedade}`);
  },

  // Buscar um solo específico
  async getSoloById(id: number): Promise<ApiResponse<Solo>> {
    return apiClient.get<Solo>(API_ENDPOINTS.SOLO_BY_ID(id));
  },

  // Criar novo solo
  async createSolo(data: SoloCreateDTO): Promise<ApiResponse<Solo>> {
    return apiClient.post<Solo>(API_ENDPOINTS.SOLOS, data);
  },

  // Atualizar solo
  async updateSolo(id: number, data: Partial<SoloCreateDTO>): Promise<ApiResponse<Solo>> {
    return apiClient.post<Solo>(API_ENDPOINTS.SOLO_BY_ID(id), data);
  },
};