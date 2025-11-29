// Configurações da API
export const API_CONFIG = {
  BASE_URL: 'https://localhost:7137/api', // Para testes no navegador
  TIMEOUT: 10000, // 10 segundos
};

// ⚠️ ATENÇÃO: Esses endpoints são os REAIS da sua API C#!
export const API_ENDPOINTS = {
  // Solo
  SOLOS: '/Solo',
  SOLO_BY_ID: (id: number) => `/Solo/${id}`,
  
  // Sensor
  SENSORES: '/Sensor',
  SENSOR_BY_ID: (id: number) => `/Sensor/${id}`,
  
  // Cultura
  CULTURAS: '/Cultura',
  CULTURA_BY_ID: (id: number) => `/Cultura/${id}`,
  
  // Histórico
  HISTORICO_ULTIMO: '/Historico/ultimo',
  HISTORICO_DIARIO: (data: string) => `/Historico/diario?data=${data}`,
  HISTORICO_MENSAL: (mes: number, ano: number) => `/Historico/mensal?mes=${mes}&ano=${ano}`,
  HISTORICO_ANUAL: (ano: number) => `/Historico/anual?ano=${ano}`,
  
  // Usuário
  USUARIO: '/Usuario',
  USUARIO_LOGIN: '/Usuario/Login',
  USUARIO_UPDATE: (id: number) => `/Usuario/${id}`,
};