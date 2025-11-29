# 🌱 Simulador ESP8266 - Soil Brief

Simulador do servidor Web gerado pelo microcontrolador ESP8266 para o projeto Soil Brief. Este projeto permite que a equipe teste e desenvolva o frontend sem necessidade do hardware real.

## 📋 Características

- **Simula perfeitamente o JSON** retornado pelo ESP8266
- **Variação automática** dos valores de nutrientes e umidade
- **Configurável** - fácil ajuste de probabilidades, valores e intervalos
- **Debug integrado** - visualize o estado da simulação em tempo real

## 🚀 Como usar

### 1. Instalar dependências

```bash
npm install
```

### 2. Iniciar o servidor

```bash
npm start
```

Ou, para desenvolvimento com auto-reload:

```bash
npm run dev
```

### 3. Acessar no navegador

- **Interface principal**: http://localhost
- **Dados JSON**: http://localhost/json
- **Debug**: http://localhost/debug
- **Configurações**: http://localhost/config

## ⚙️ Configurações

Todas as configurações estão centralizadas no início do arquivo `server.js` no objeto `CONFIG`:

```javascript
const CONFIG = {
  // Valores base dos nutrientes e umidade
  valoresBase: {
    nitrogenio: 32,
    fosforo: 156,
    potassio: 427,
    umidade: 39
  },
  
  // Variação permitida para cada nutriente (±1)
  variacaoNutrientes: {
    nitrogenio: 1,
    fosforo: 1,
    potassio: 1
  },
  
  // Faixa de variação da umidade
  faixaUmidade: {
    min: 34,
    max: 41
  },
  
  // Probabilidades de variação (0-100%)
  probabilidades: {
    nitrogenio: 10,  // 10% de chance
    fosforo: 15,     // 15% de chance
    potassio: 20,    // 20% de chance
    umidade: 10      // 10% de chance
  },
  
  // Intervalo de atualização em milissegundos
  intervaloAtualizacao: 3000  // 3 segundos
};
```

### Como editar:

1. Abra o arquivo `server.js`
2. Localize o objeto `CONFIG` no início do arquivo
3. Modifique os valores desejados
4. Salve e reinicie o servidor

## 📊 Estrutura do JSON

O endpoint `/json` retorna exatamente a mesma estrutura do ESP8266:

```json
{
  "npkSensorId": 1,
  "nitrogenio": 32,
  "fosforo": 156,
  "potassio": 427,
  "unidadeNpk": "mg/kg",
  "lastUpdate": 1698876543210,
  "moistureSensorId": 2,
  "umidadeSolo": 39,
  "unidadeUmidade": "%",
  "lastUpdateUmidade": 1698876543210,
  "uptime": 120
}
```

## 🔧 Comportamento da Simulação

### Nutrientes (N, P, K)
- Cada nutriente pode variar **±1** do seu valor atual
- Probabilidades independentes:
  - Nitrogênio: **10%** a cada 3 segundos
  - Fósforo: **15%** a cada 3 segundos
  - Potássio: **20%** a cada 3 segundos

### Umidade
- Varia aleatoriamente dentro da faixa **34-41%**
- Probabilidade: **10%** a cada 3 segundos

### Timestamps
- `lastUpdate`: atualizado quando qualquer valor NPK muda
- `lastUpdateUmidade`: atualizado quando a umidade muda
- `uptime`: tempo desde o início da simulação em segundos

## 📁 Estrutura de Arquivos

```
esp-simulation/
├── server.js           # Servidor Node.js com lógica de simulação
├── package.json        # Dependências do projeto
├── index.html          # Interface web (opcional)
├── script.js           # Scripts do frontend (opcional)
├── styles.css          # Estilos (opcional)
├── README.md           # Esta documentação
├── arduino-latest.c++  # Firmware Arduino (referência)
└── esp-latest.c++      # Firmware ESP8266 (referência)
```

## 🐛 Debug

Acesse http://localhost/debug para ver:
- Configurações atuais da simulação
- Valores em tempo real
- Timestamps
- Uptime do servidor

A página atualiza automaticamente a cada 3 segundos.

## 📝 Notas

- O servidor roda na **porta 80** (padrão do ESP8266)
- No Windows, pode ser necessário executar como administrador para usar a porta 80
- Alternativamente, mude a porta no `server.js`: `const PORT = 3000;`

## 🤝 Contribuindo

Para modificar o comportamento da simulação, edite a função `atualizarSimulacao()` no arquivo `server.js`.

## 📄 Licença

MIT
