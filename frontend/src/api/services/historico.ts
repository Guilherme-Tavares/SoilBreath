import { apiClient, ApiResponse } from '../client';
import { API_ENDPOINTS } from '../config';

// Interfaces baseadas nos DTOs C#
export interface HistoricoDiario {
  data: string;
  nitrogenio: number;
  fosforo: number;
  potassio: number;
  umidade: number;
  temperatura: number;
  temDados: boolean;
}

export interface HistoricoMensal {
  mes: number;
  ano: number;
  mesNome: string;
  nitrogenioMedio: number;
  fosforoMedio: number;
  potassioMedio: number;
  umidadeMedia: number;
  temperaturaMedia: number;
  totalDias: number;
  temDados: boolean;
}

export interface HistoricoAnual {
  ano: number;
  nitrogenioMedio: number;
  fosforoMedio: number;
  potassioMedio: number;
  umidadeMedia: number;
  temperaturaMedia: number;
  totalDias: number;
  temDados: boolean;
}

export interface UltimoRegistro {
  data: string | null;
  temRegistros: boolean;
}

// Serviço de Histórico
export const historicoService = {
  // Buscar último registro
  async getUltimoRegistro(): Promise<ApiResponse<UltimoRegistro>> {
    return apiClient.get<UltimoRegistro>(API_ENDPOINTS.HISTORICO_ULTIMO);
  },

  // Buscar dados diários (data no formato YYYY-MM-DD)
  async getDadosDiarios(data: string): Promise<ApiResponse<HistoricoDiario>> {
    return apiClient.get<HistoricoDiario>(API_ENDPOINTS.HISTORICO_DIARIO(data));
  },

  // Buscar dados mensais
  async getDadosMensais(mes: number, ano: number): Promise<ApiResponse<HistoricoMensal>> {
    return apiClient.get<HistoricoMensal>(API_ENDPOINTS.HISTORICO_MENSAL(mes, ano));
  },

  // Buscar dados anuais
  async getDadosAnuais(ano: number): Promise<ApiResponse<HistoricoAnual>> {
    return apiClient.get<HistoricoAnual>(API_ENDPOINTS.HISTORICO_ANUAL(ano));
  },
};
