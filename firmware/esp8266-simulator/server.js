const express = require('express');
const path = require('path');

const app = express();
const PORT = 80; // Porta padrão do ESP8266

// ========================================
// CONFIGURAÇÕES DE SIMULAÇÃO
// ========================================
const CONFIG = {
  // Valores base dos nutrientes e umidade
  valoresBase: {
    nitrogenio: 32,
    fosforo: 156,
    potassio: 427,
    umidadeSolo: 39,
    temperatura: 27.5,
    umidadeAr: 60
  },
  
  // Variação permitida para cada nutriente (±1)
  variacaoNutrientes: {
    nitrogenio: 1,
    fosforo: 1,
    potassio: 1
  },
  
  // Faixa de variação da umidade do solo
  faixaUmidadeSolo: {
    min: 34,
    max: 41
  },
  
  // Faixa de variação da temperatura (°C)
  faixaTemperatura: {
    min: 20,
    max: 35
  },
  
  // Faixa de variação da umidade do ar (%)
  faixaUmidadeAr: {
    min: 40,
    max: 80
  },
  
  // Probabilidades de variação (0-100%)
  probabilidades: {
    nitrogenio: 10,      // 10% de chance
    fosforo: 15,         // 15% de chance
    potassio: 20,        // 20% de chance
    umidadeSolo: 10,     // 10% de chance
    temperatura: 5,      // 5% de chance
    umidadeAr: 5         // 5% de chance
  },
  
  // Intervalo de atualização em milissegundos
  intervaloAtualizacao: 3000  // 3 segundos
};

// ========================================
// ESTADO DA SIMULAÇÃO
// ========================================
let simulacao = {
  // Valores atuais
  nitrogenio: CONFIG.valoresBase.nitrogenio,
  fosforo: CONFIG.valoresBase.fosforo,
  potassio: CONFIG.valoresBase.potassio,
  umidadeSolo: CONFIG.valoresBase.umidadeSolo,
  temperatura: CONFIG.valoresBase.temperatura,
  umidadeAr: CONFIG.valoresBase.umidadeAr,
  
  // Timestamps
  lastUpdate: 0,
  lastUpdateUmidade: 0,
  lastUpdateDHT: 0,
  inicioSimulacao: Date.now()
};

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

/**
 * Verifica se uma variação deve ocorrer baseada na probabilidade
 * @param {number} probabilidade - Probabilidade de 0 a 100
 * @returns {boolean}
 */
function deveVariar(probabilidade) {
  return Math.random() * 100 < probabilidade;
}

/**
 * Aplica variação de ±1 ao valor
 * @param {number} valorAtual 
 * @param {number} variacaoMax 
 * @returns {number}
 */
function aplicarVariacao(valorAtual, variacaoMax) {
  const direcao = Math.random() < 0.5 ? -1 : 1;
  return valorAtual + (direcao * variacaoMax);
}

/**
 * Gera novo valor de umidade do solo dentro da faixa permitida
 * @returns {number}
 */
function gerarNovaUmidadeSolo() {
  const { min, max } = CONFIG.faixaUmidadeSolo;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Gera novo valor de temperatura dentro da faixa permitida
 * @returns {number}
 */
function gerarNovaTemperatura() {
  const { min, max } = CONFIG.faixaTemperatura;
  return parseFloat((Math.random() * (max - min) + min).toFixed(1));
}

/**
 * Gera novo valor de umidade do ar dentro da faixa permitida
 * @returns {number}
 */
function gerarNovaUmidadeAr() {
  const { min, max } = CONFIG.faixaUmidadeAr;
  return parseFloat((Math.random() * (max - min) + min).toFixed(1));
}

/**
 * Atualiza os valores da simulação
 */
function atualizarSimulacao() {
  const agora = Date.now();
  
  // Atualiza Nitrogênio (10% de chance)
  if (deveVariar(CONFIG.probabilidades.nitrogenio)) {
    simulacao.nitrogenio = aplicarVariacao(
      simulacao.nitrogenio,
      CONFIG.variacaoNutrientes.nitrogenio
    );
    simulacao.lastUpdate = agora;
  }
  
  // Atualiza Fósforo (15% de chance)
  if (deveVariar(CONFIG.probabilidades.fosforo)) {
    simulacao.fosforo = aplicarVariacao(
      simulacao.fosforo,
      CONFIG.variacaoNutrientes.fosforo
    );
    simulacao.lastUpdate = agora;
  }
  
  // Atualiza Potássio (20% de chance)
  if (deveVariar(CONFIG.probabilidades.potassio)) {
    simulacao.potassio = aplicarVariacao(
      simulacao.potassio,
      CONFIG.variacaoNutrientes.potassio
    );
    simulacao.lastUpdate = agora;
  }
  
  // Atualiza Umidade do Solo (10% de chance, dentro da faixa 34-41)
  if (deveVariar(CONFIG.probabilidades.umidadeSolo)) {
    simulacao.umidadeSolo = gerarNovaUmidadeSolo();
    simulacao.lastUpdateUmidade = agora;
  }
  
  // Atualiza Temperatura do Ar (5% de chance, dentro da faixa 20-35°C)
  if (deveVariar(CONFIG.probabilidades.temperatura)) {
    simulacao.temperatura = gerarNovaTemperatura();
    simulacao.lastUpdateDHT = agora;
  }
  
  // Atualiza Umidade do Ar (5% de chance, dentro da faixa 40-80%)
  if (deveVariar(CONFIG.probabilidades.umidadeAr)) {
    simulacao.umidadeAr = gerarNovaUmidadeAr();
    simulacao.lastUpdateDHT = agora;
  }
}

// ========================================
// ROTAS DO SERVIDOR
// ========================================

// Rota principal - página de informações
app.get('/', (req, res) => {
  const uptime = Math.floor((Date.now() - simulacao.inicioSimulacao) / 1000);
  
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simulador ESP8266 - Soil Brief</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          padding: 40px;
          max-width: 600px;
          width: 100%;
        }
        h1 {
          color: #333;
          text-align: center;
          margin-bottom: 10px;
          font-size: 2.5em;
        }
        .subtitle {
          text-align: center;
          color: #666;
          margin-bottom: 30px;
          font-size: 1.1em;
        }
        .info {
          background: #f5f7fa;
          border-radius: 10px;
          padding: 20px;
          margin: 20px 0;
        }
        .info h2 {
          color: #667eea;
          margin-bottom: 15px;
          font-size: 1.3em;
        }
        .info p {
          color: #555;
          line-height: 1.6;
          margin: 10px 0;
        }
        .endpoint {
          background: #667eea;
          color: white;
          padding: 15px;
          border-radius: 10px;
          margin: 10px 0;
          text-align: center;
          font-weight: bold;
        }
        .link {
          display: block;
          text-align: center;
          margin: 10px 0;
          padding: 15px;
          background: #667eea;
          color: white;
          text-decoration: none;
          border-radius: 10px;
          transition: background 0.3s ease;
        }
        .link:hover {
          background: #764ba2;
        }
        .status {
          text-align: center;
          color: #4caf50;
          font-weight: bold;
          margin: 20px 0;
          font-size: 1.2em;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🌱 Simulador ESP8266</h1>
        <p class="subtitle">Projeto Soil Brief - Monitor NPK</p>
        
        <div class="status">✅ Servidor ativo (Uptime: ${uptime}s)</div>
        
        <div class="info">
          <h2>📡 Endpoints Disponíveis</h2>
          <div class="endpoint">GET /json</div>
          <p>Retorna os dados dos sensores em formato JSON (compatível com ESP8266)</p>
          
          <div class="endpoint">GET /debug</div>
          <p>Página de debug com informações da simulação</p>
          
          <div class="endpoint">GET /config</div>
          <p>Configurações da simulação em formato JSON</p>
        </div>
        
        <div class="info">
          <h2>📊 Valores Atuais</h2>
          <p><strong>Nitrogênio (N):</strong> ${simulacao.nitrogenio} mg/kg</p>
          <p><strong>Fósforo (P):</strong> ${simulacao.fosforo} mg/kg</p>
          <p><strong>Potássio (K):</strong> ${simulacao.potassio} mg/kg</p>
          <p><strong>Umidade do Solo:</strong> ${simulacao.umidadeSolo}%</p>
          <p><strong>Temperatura do Ar:</strong> ${simulacao.temperatura}°C</p>
          <p><strong>Umidade do Ar:</strong> ${simulacao.umidadeAr}%</p>
        </div>
        
        <a href="/json" class="link" target="_blank">📊 Ver JSON</a>
        <a href="/debug" class="link" target="_blank">🔍 Debug</a>
        <a href="/config" class="link" target="_blank">⚙️ Configurações</a>
      </div>
    </body>
    </html>
  `);
});

// Rota JSON - retorna os dados do sensor (igual ao ESP8266)
app.get('/json', (req, res) => {
  const uptime = Math.floor((Date.now() - simulacao.inicioSimulacao) / 1000);
  
  const dadosJson = {
    npkSensorId: 1,
    nitrogenio: simulacao.nitrogenio,
    fosforo: simulacao.fosforo,
    potassio: simulacao.potassio,
    unidadeNpk: "mg/kg",
    lastUpdateNPK: simulacao.lastUpdate,
    moistureSensorId: 2,
    umidadeSolo: simulacao.umidadeSolo,
    unidadeUmidadeSolo: "%",
    lastUpdateUmidadeSolo: simulacao.lastUpdateUmidade,
    dhtSensorId: 3,
    temperatura: simulacao.temperatura,
    umidadeAr: simulacao.umidadeAr,
    unidadeTemperatura: "°C",
    unidadeUmidadeAr: "%",
    lastUpdateDHT: simulacao.lastUpdateDHT,
    uptime: uptime
  };
  
  res.json(dadosJson);
});

// Rota de debug - informações sobre a simulação
app.get('/debug', (req, res) => {
  const uptime = Math.floor((Date.now() - simulacao.inicioSimulacao) / 1000);
  
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Debug - Simulador ESP8266</title>
      <style>
        body { font-family: monospace; background: #1e1e1e; color: #d4d4d4; padding: 20px; }
        h1 { color: #4ec9b0; }
        .info { background: #252526; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .value { color: #ce9178; }
        .key { color: #9cdcfe; }
        .button { display: inline-block; padding: 10px 20px; background: #0e639c; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
        .button:hover { background: #1177bb; }
      </style>
      <script>
        setTimeout(function(){ location.reload(); }, ${CONFIG.intervaloAtualizacao});
      </script>
    </head>
    <body>
      <h1>🔍 Debug - Simulador ESP8266</h1>
      
      <div class="info">
        <h2>⚙️ Configurações da Simulação</h2>
        <span class="key">Intervalo de atualização:</span> <span class="value">${CONFIG.intervaloAtualizacao}ms</span><br>
        <span class="key">Valores base N/P/K:</span> <span class="value">${CONFIG.valoresBase.nitrogenio}/${CONFIG.valoresBase.fosforo}/${CONFIG.valoresBase.potassio}</span><br>
        <span class="key">Valor base umidade solo:</span> <span class="value">${CONFIG.valoresBase.umidadeSolo}%</span><br>
        <span class="key">Valor base temperatura:</span> <span class="value">${CONFIG.valoresBase.temperatura}°C</span><br>
        <span class="key">Valor base umidade ar:</span> <span class="value">${CONFIG.valoresBase.umidadeAr}%</span><br>
        <span class="key">Faixa umidade solo:</span> <span class="value">${CONFIG.faixaUmidadeSolo.min}-${CONFIG.faixaUmidadeSolo.max}%</span><br>
        <span class="key">Faixa temperatura:</span> <span class="value">${CONFIG.faixaTemperatura.min}-${CONFIG.faixaTemperatura.max}°C</span><br>
        <span class="key">Faixa umidade ar:</span> <span class="value">${CONFIG.faixaUmidadeAr.min}-${CONFIG.faixaUmidadeAr.max}%</span><br>
        <span class="key">Probabilidade N/P/K:</span> <span class="value">${CONFIG.probabilidades.nitrogenio}%/${CONFIG.probabilidades.fosforo}%/${CONFIG.probabilidades.potassio}%</span><br>
        <span class="key">Probabilidade sensores:</span> <span class="value">Solo:${CONFIG.probabilidades.umidadeSolo}% Temp:${CONFIG.probabilidades.temperatura}% Ar:${CONFIG.probabilidades.umidadeAr}%</span>
      </div>
      
      <div class="info">
        <h2>📊 Valores Atuais</h2>
        <span class="key">Nitrogênio (N):</span> <span class="value">${simulacao.nitrogenio} mg/kg</span><br>
        <span class="key">Fósforo (P):</span> <span class="value">${simulacao.fosforo} mg/kg</span><br>
        <span class="key">Potássio (K):</span> <span class="value">${simulacao.potassio} mg/kg</span><br>
        <span class="key">Umidade do Solo:</span> <span class="value">${simulacao.umidadeSolo}%</span><br>
        <span class="key">Temperatura do Ar:</span> <span class="value">${simulacao.temperatura}°C</span><br>
        <span class="key">Umidade do Ar:</span> <span class="value">${simulacao.umidadeAr}%</span><br>
        <span class="key">Last Update NPK:</span> <span class="value">${simulacao.lastUpdate}ms</span><br>
        <span class="key">Last Update Umidade Solo:</span> <span class="value">${simulacao.lastUpdateUmidade}ms</span><br>
        <span class="key">Last Update DHT:</span> <span class="value">${simulacao.lastUpdateDHT}ms</span><br>
        <span class="key">Uptime:</span> <span class="value">${uptime}s</span>
      </div>
      
      <a href="/" class="button">🏠 Voltar</a>
      <a href="/debug" class="button">🔄 Atualizar</a>
      <a href="/json" class="button">📊 JSON</a>
    </body>
    </html>
  `);
});

// Rota para configurações (permite ver/editar CONFIG via JSON)
app.get('/config', (req, res) => {
  res.json(CONFIG);
});

// ========================================
// INICIALIZAÇÃO DO SERVIDOR
// ========================================

// Inicia o timer de atualização
setInterval(atualizarSimulacao, CONFIG.intervaloAtualizacao);

// Inicializa valores de timestamp
simulacao.lastUpdate = Date.now();
simulacao.lastUpdateUmidade = Date.now();
simulacao.lastUpdateDHT = Date.now();

// Inicia o servidor
app.listen(PORT, () => {
  console.log('========================================')
  console.log('🌱 Simulador ESP8266 - Soil Brief');
  console.log('========================================');
  console.log(`Servidor rodando em: http://localhost:${PORT}`);
  console.log(`Rota JSON: http://localhost:${PORT}/json`);
  console.log(`Debug: http://localhost:${PORT}/debug`);
  console.log(`Config: http://localhost:${PORT}/config`);
  console.log('========================================');
  console.log('Configurações:');
  console.log(`  Intervalo de atualização: ${CONFIG.intervaloAtualizacao}ms`);
  console.log(`  Valores base N/P/K: ${CONFIG.valoresBase.nitrogenio}/${CONFIG.valoresBase.fosforo}/${CONFIG.valoresBase.potassio}`);
  console.log(`  Faixa umidade solo: ${CONFIG.faixaUmidadeSolo.min}-${CONFIG.faixaUmidadeSolo.max}%`);
  console.log(`  Faixa temperatura: ${CONFIG.faixaTemperatura.min}-${CONFIG.faixaTemperatura.max}°C`);
  console.log(`  Faixa umidade ar: ${CONFIG.faixaUmidadeAr.min}-${CONFIG.faixaUmidadeAr.max}%`);
  console.log(`  Probabilidades N/P/K: ${CONFIG.probabilidades.nitrogenio}%/${CONFIG.probabilidades.fosforo}%/${CONFIG.probabilidades.potassio}%`);
  console.log(`  Probabilidades Solo/Temp/Ar: ${CONFIG.probabilidades.umidadeSolo}%/${CONFIG.probabilidades.temperatura}%/${CONFIG.probabilidades.umidadeAr}%`);
  console.log('========================================');
  console.log('Pressione Ctrl+C para parar o servidor\n');
});
