import { apiClient, ApiResponse } from '../client';
import { API_ENDPOINTS } from '../config';

// Interface baseada no DTO C# CulturaDTO
export interface Cultura {
  id: number;
  nome: string;
  nitrogenio: number;
  fosforo: number;
  potassio: number;
  umidade: number;
  temperatura: number;
}

// Interface baseada no DTO C# AptidaoDTO
export interface AptidaoCultura {
  culturaId: number;
  culturaNome: string;
  nitrogenioPct: number;
  fosforoPct: number;
  potassioPct: number;
  mediaPct: number;
}

// Interface baseada no DTO C# AptidaoSoloDTO
export interface AptidaoSolo {
  soloId: number;
  soloIdentificacao: string;
  nitrogenio: number;
  fosforo: number;
  potassio: number;
  aptidoes: AptidaoCultura[];
}

// Serviço de Cultura
export const culturaService = {
  // Buscar todas as culturas
  async getCulturas(): Promise<ApiResponse<Cultura[]>> {
    return apiClient.get<Cultura[]>(API_ENDPOINTS.CULTURAS);
  },

  // Buscar uma cultura específica
  async getCulturaById(id: number): Promise<ApiResponse<Cultura>> {
    return apiClient.get<Cultura>(API_ENDPOINTS.CULTURA_BY_ID(id));
  },

  // Calcular aptidões de um solo para todas as culturas
  async getAptidoesPorSolo(soloId: number): Promise<ApiResponse<AptidaoSolo>> {
    return apiClient.get<AptidaoSolo>(`${API_ENDPOINTS.CULTURAS}/aptidao/solo/${soloId}`);
  },
};
