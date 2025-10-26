// Configurações da API
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5135/api', // Para testes no navegador
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
  
  // Usuário
  USUARIO: '/Usuario',
  USUARIO_LOGIN: '/Usuario/Login',
  USUARIO_UPDATE: (id: number) => `/Usuario/${id}`,
};