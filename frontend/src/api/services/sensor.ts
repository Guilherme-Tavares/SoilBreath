import { apiClient, ApiResponse } from '../client';
import { API_ENDPOINTS } from '../config';
import { Solo } from './soil';

// ✅ Baseado no modelo C# "Sensor"
export interface Sensor {
  id: number;
  idSensor: string;
  soloId: number;
  // Relacionamento (opcional)
  solo?: Solo;
}

// Para criar/atualizar sensor
export interface SensorCreateDTO {
  idSensor: string;
  soloId: number;
}

// Serviço de Sensores
export const sensorService = {
  // Buscar todos os sensores de uma propriedade
  async getSensores(idPropriedade: number): Promise<ApiResponse<Sensor[]>> {
    return apiClient.get<Sensor[]>(`${API_ENDPOINTS.SENSORES}?idPropriedade=${idPropriedade}`);
  },

  // Buscar um sensor específico
  async getSensorById(id: number): Promise<ApiResponse<Sensor>> {
    return apiClient.get<Sensor>(API_ENDPOINTS.SENSOR_BY_ID(id));
  },

  // Criar novo sensor
  async createSensor(data: SensorCreateDTO): Promise<ApiResponse<Sensor>> {
    return apiClient.post<Sensor>(API_ENDPOINTS.SENSORES, data);
  },

  // Atualizar sensor
  async updateSensor(id: number, data: Partial<SensorCreateDTO>): Promise<ApiResponse<Sensor>> {
    return apiClient.post<Sensor>(API_ENDPOINTS.SENSOR_BY_ID(id), data);
  },
};