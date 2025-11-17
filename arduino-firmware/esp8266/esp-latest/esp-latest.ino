#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <SoftwareSerial.h>

// Configurações WiFi
const char* ssid = "NPK Server";           // Altere para o nome da sua rede WiFi
const char* password = "12345678";      // Altere para a senha da sua rede WiFi

// Servidor Web na porta 80
ESP8266WebServer server(80);

// Pinos para comunicação com Arduino via SoftwareSerial
#define ARDUINO_RX_PIN D2  // GPIO4 - Recebe dados do Arduino TX
#define ARDUINO_TX_PIN D1  // GPIO5 - Não usado (apenas RX)

// Cria objeto SoftwareSerial para comunicação com Arduino
SoftwareSerial arduinoSerial(ARDUINO_RX_PIN, ARDUINO_TX_PIN); // RX, TX

// Variáveis para armazenar os valores NPK
struct NPKData {
  uint16_t nitrogenio = 0;
  uint16_t fosforo = 0;
  uint16_t potassio = 0;
  unsigned long lastUpdate = 0;
} npkData;

// Variáveis para armazenar valores do sensor de umidade
struct MoistureData {
  uint8_t percentualUmidade = 0;
  unsigned long lastUpdate = 0;
} moistureData;

// Buffer para leitura serial
String serialBuffer = "";

// Buffer para debug - armazena últimas 10 linhas recebidas
String debugBuffer[10];
int debugIndex = 0;
int debugCount = 0;
unsigned long totalBytesReceived = 0;
unsigned long lastByteTime = 0;

void setup() {
  // Inicializa comunicação serial para debug USB (CH340G)
  Serial.begin(115200);
  delay(100);
  
  Serial.println("\n\n=================================");
  Serial.println("ESP8266 - Receptor NPK via SoftwareSerial");
  Serial.println("=================================");
  Serial.print("RX Pin: D2 (GPIO");
  Serial.print(ARDUINO_RX_PIN);
  Serial.println(")");
  Serial.println("Baud Rate Arduino: 9600");
  Serial.println("=================================\n");
  
  // Inicializa SoftwareSerial para comunicação com Arduino
  arduinoSerial.begin(9600);
  
  // Limpa buffer inicial
  while(arduinoSerial.available()) {
    arduinoSerial.read();
  }
  
  // Cria Access Point (ESP8266 como servidor WiFi)
  WiFi.mode(WIFI_AP);  // Modo Access Point
  WiFi.softAP(ssid, password);
  
  // Aguarda inicialização do AP
  delay(100);
  
  Serial.println("\n--- Access Point Criado ---");
  Serial.print("SSID: ");
  Serial.println(ssid);
  Serial.print("IP do Access Point: ");
  Serial.println(WiFi.softAPIP());
  Serial.println("---------------------------\n");
  
  // Configura as rotas do servidor web
  server.on("/", handleRoot);
  server.on("/json", handleJSON);
  server.on("/debug", handleDebug);  // Nova rota de debug
  server.onNotFound(handleNotFound);
  
  // Inicia o servidor
  server.begin();
}

void loop() {
  // Processa requisições HTTP
  server.handleClient();
  
  // Lê dados do Arduino via Serial
  readSerialData();
}

// Função para ler dados da serial do Arduino via SoftwareSerial
void readSerialData() {
  while (arduinoSerial.available() > 0) {
    char c = arduinoSerial.read();
    totalBytesReceived++;
    lastByteTime = millis();
    
    // Processa tanto \n quanto \r como fim de linha
    if (c == '\n' || c == '\r') {
      if (serialBuffer.length() > 0) {
        // Processa a linha completa
        parseSerialData(serialBuffer);
        serialBuffer = "";
      }
    } else if (c >= 32 && c <= 126) {
      // Adiciona apenas caracteres imprimíveis
      serialBuffer += c;
      
      // Segurança: limita tamanho do buffer
      if (serialBuffer.length() > 200) {
        serialBuffer = "";
      }
    }
  }
}

// Função para extrair valores NPK da string recebida
void parseSerialData(String data) {
  // Remove caracteres de espaço
  data.trim();
  
  // Armazena no buffer de debug
  if (data.length() > 0) {
    debugBuffer[debugIndex] = data;
    debugIndex = (debugIndex + 1) % 10;
    if (debugCount < 10) debugCount++;
  }
  
  // Procura por padrões de dados (com e sem acentos)
  // Nitrogênio detecta: "Nitrogênio", "Nitrogenio", "Nitrognio", ou "(N)"
  if (data.indexOf("Nitrog") >= 0 || data.indexOf("(N)") >= 0) {
    int idx = data.indexOf("]:") + 2;
    if (idx > 1) {
      String value = data.substring(idx);
      value.trim();
      // Remove " mg/kg" se existir
      int mgIdx = value.indexOf(" mg");
      if (mgIdx > 0) {
        value = value.substring(0, mgIdx);
      }
      npkData.nitrogenio = value.toInt();
      Serial.print("✓ N: ");
      Serial.println(npkData.nitrogenio);
    }
  }
  // Fósforo detecta: "Fósforo", "Fosforo", "Fsforo", ou "(P)"
  else if (data.indexOf("Fsf") >= 0 || data.indexOf("Fosf") >= 0 || data.indexOf("(P)") >= 0) {
    int idx = data.indexOf("]:") + 2;
    if (idx > 1) {
      String value = data.substring(idx);
      value.trim();
      // Remove " mg/kg" se existir
      int mgIdx = value.indexOf(" mg");
      if (mgIdx > 0) {
        value = value.substring(0, mgIdx);
      }
      npkData.fosforo = value.toInt();
      Serial.print("✓ P: ");
      Serial.println(npkData.fosforo);
    }
  }
  // Potássio detecta: "Potássio", "Potassio", "Potssio", ou "(K)"
  else if (data.indexOf("Pot") >= 0 || data.indexOf("(K)") >= 0) {
    int idx = data.indexOf("]:") + 2;
    if (idx > 1) {
      String value = data.substring(idx);
      value.trim();
      // Remove " mg/kg" se existir
      int mgIdx = value.indexOf(" mg");
      if (mgIdx > 0) {
        value = value.substring(0, mgIdx);
      }
      npkData.potassio = value.toInt();
      npkData.lastUpdate = millis();
      Serial.print("✓ K: ");
      Serial.println(npkData.potassio);
    }
  }
  // Umidade do Solo detecta: "Umidade do Solo" ou "[A0]"
  else if (data.indexOf("Umidade do Solo") >= 0 || data.indexOf("[A0]") >= 0) {
    int idx = data.indexOf("]:") + 2;
    if (idx > 1) {
      String value = data.substring(idx);
      value.trim();
      // Remove " %" se existir
      int percentIdx = value.indexOf(" %");
      if (percentIdx > 0) {
        value = value.substring(0, percentIdx);
      }
      moistureData.percentualUmidade = value.toInt();
      moistureData.lastUpdate = millis();
      Serial.print("✓ Umidade: ");
      Serial.print(moistureData.percentualUmidade);
      Serial.println("%");
    }
  }
}

// Página HTML principal
void handleRoot() {
  String html = "<!DOCTYPE html>\n";
  html += "<html lang='pt-BR'>\n";
  html += "<head>\n";
  html += "  <meta charset='UTF-8'>\n";
  html += "  <meta name='viewport' content='width=device-width, initial-scale=1.0'>\n";
  html += "  <title>Monitor NPK</title>\n";
  html += "  <style>\n";
  html += "    * { margin: 0; padding: 0; box-sizing: border-box; }\n";
  html += "    body {\n";
  html += "      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n";
  html += "      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n";
  html += "      min-height: 100vh;\n";
  html += "      display: flex;\n";
  html += "      justify-content: center;\n";
  html += "      align-items: center;\n";
  html += "      padding: 20px;\n";
  html += "    }\n";
  html += "    .container {\n";
  html += "      background: white;\n";
  html += "      border-radius: 20px;\n";
  html += "      box-shadow: 0 20px 60px rgba(0,0,0,0.3);\n";
  html += "      padding: 40px;\n";
  html += "      max-width: 600px;\n";
  html += "      width: 100%;\n";
  html += "    }\n";
  html += "    h1 {\n";
  html += "      color: #333;\n";
  html += "      text-align: center;\n";
  html += "      margin-bottom: 10px;\n";
  html += "      font-size: 2.5em;\n";
  html += "    }\n";
  html += "    .subtitle {\n";
  html += "      text-align: center;\n";
  html += "      color: #666;\n";
  html += "      margin-bottom: 30px;\n";
  html += "      font-size: 1.1em;\n";
  html += "    }\n";
  html += "    .card {\n";
  html += "      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);\n";
  html += "      border-radius: 15px;\n";
  html += "      padding: 25px;\n";
  html += "      margin-bottom: 20px;\n";
  html += "      transition: transform 0.3s ease;\n";
  html += "    }\n";
  html += "    .card:hover {\n";
  html += "      transform: translateY(-5px);\n";
  html += "    }\n";
  html += "    .card-title {\n";
  html += "      font-size: 1.2em;\n";
  html += "      color: #555;\n";
  html += "      margin-bottom: 10px;\n";
  html += "    }\n";
  html += "    .card-value {\n";
  html += "      font-size: 2.5em;\n";
  html += "      font-weight: bold;\n";
  html += "      color: #667eea;\n";
  html += "    }\n";
  html += "    .card-unit {\n";
  html += "      font-size: 1em;\n";
  html += "      color: #888;\n";
  html += "      margin-left: 5px;\n";
  html += "    }\n";
  html += "    .update-time {\n";
  html += "      text-align: center;\n";
  html += "      color: #999;\n";
  html += "      margin-top: 20px;\n";
  html += "      font-size: 0.9em;\n";
  html += "    }\n";
  html += "    .json-link {\n";
  html += "      display: block;\n";
  html += "      text-align: center;\n";
  html += "      margin-top: 20px;\n";
  html += "      padding: 15px;\n";
  html += "      background: #667eea;\n";
  html += "      color: white;\n";
  html += "      text-decoration: none;\n";
  html += "      border-radius: 10px;\n";
  html += "      transition: background 0.3s ease;\n";
  html += "    }\n";
  html += "    .json-link:hover {\n";
  html += "      background: #764ba2;\n";
  html += "    }\n";
  html += "  </style>\n";
  html += "  <script>\n";
  html += "    function atualizarDados() {\n";
  html += "      fetch('/json')\n";
  html += "        .then(response => response.json())\n";
  html += "        .then(data => {\n";
  html += "          document.getElementById('nitrogenio').textContent = data.nitrogenio;\n";
  html += "          document.getElementById('fosforo').textContent = data.fosforo;\n";
  html += "          document.getElementById('potassio').textContent = data.potassio;\n";
  html += "          document.getElementById('umidade').textContent = data.umidadeSolo;\n";
  html += "          document.getElementById('lastUpdate').textContent = 'Última atualização: ' + new Date().toLocaleTimeString('pt-BR');\n";
  html += "        });\n";
  html += "    }\n";
  html += "    setInterval(atualizarDados, 3000);\n";
  html += "  </script>\n";
  html += "</head>\n";
  html += "<body>\n";
  html += "  <div class='container'>\n";
  html += "    <h1>🌱 Monitor NPK</h1>\n";
  html += "    <p class='subtitle'>Sensor de Nutrientes do Solo</p>\n";
  html += "    \n";
  html += "    <div class='card'>\n";
  html += "      <div class='card-title'>Nitrogênio (N)</div>\n";
  html += "      <div class='card-value'><span id='nitrogenio'>" + String(npkData.nitrogenio) + "</span><span class='card-unit'>mg/kg</span></div>\n";
  html += "    </div>\n";
  html += "    \n";
  html += "    <div class='card'>\n";
  html += "      <div class='card-title'>Fósforo (P)</div>\n";
  html += "      <div class='card-value'><span id='fosforo'>" + String(npkData.fosforo) + "</span><span class='card-unit'>mg/kg</span></div>\n";
  html += "    </div>\n";
  html += "    \n";
  html += "    <div class='card'>\n";
  html += "      <div class='card-title'>Potássio (K)</div>\n";
  html += "      <div class='card-value'><span id='potassio'>" + String(npkData.potassio) + "</span><span class='card-unit'>mg/kg</span></div>\n";
  html += "    </div>\n";
  html += "    \n";
  html += "    <div class='card'>\n";
  html += "      <div class='card-title'>💧 Umidade do Solo</div>\n";
  html += "      <div class='card-value'><span id='umidade'>" + String(moistureData.percentualUmidade) + "</span><span class='card-unit'>%</span></div>\n";
  html += "    </div>\n";
  html += "    \n";
  html += "    <div class='update-time' id='lastUpdate'>Última atualização: " + String(npkData.lastUpdate / 1000) + "s</div>\n";
  html += "    \n";
  html += "    <a href='/json' class='json-link' target='_blank'>📊 Ver dados em JSON</a>\n";
  html += "    <a href='/debug' class='json-link' target='_blank' style='background: #e74c3c; margin-top: 10px;'>🔍 Debug Serial</a>\n";
  html += "  </div>\n";
  html += "</body>\n";
  html += "</html>";
  
  server.send(200, "text/html", html);
}

// Endpoint JSON
void handleJSON() {
  String json = "{\n";
  json += "  \"npkSensorId\": 1,\n";
  json += "  \"nitrogenio\": " + String(npkData.nitrogenio) + ",\n";
  json += "  \"fosforo\": " + String(npkData.fosforo) + ",\n";
  json += "  \"potassio\": " + String(npkData.potassio) + ",\n";
  json += "  \"unidadeNpk\": \"mg/kg\",\n";
  json += "  \"lastUpdate\": " + String(npkData.lastUpdate) + ",\n";
  json += "  \"moistureSensorId\": 2,\n";
  json += "  \"umidadeSolo\": " + String(moistureData.percentualUmidade) + ",\n";
  json += "  \"unidadeUmidade\": \"%\",\n";
  json += "  \"lastUpdateUmidade\": " + String(moistureData.lastUpdate) + ",\n";
  json += "  \"uptime\": " + String(millis() / 1000) + "\n";
  json += "}";
  
  server.send(200, "application/json", json);
}

// Página de debug - mostra dados recebidos da serial
void handleDebug() {
  String html = "<!DOCTYPE html>\n";
  html += "<html lang='pt-BR'>\n";
  html += "<head>\n";
  html += "  <meta charset='UTF-8'>\n";
  html += "  <meta name='viewport' content='width=device-width, initial-scale=1.0'>\n";
  html += "  <title>Debug Serial - ESP8266</title>\n";
  html += "  <style>\n";
  html += "    body { font-family: monospace; background: #1e1e1e; color: #d4d4d4; padding: 20px; }\n";
  html += "    h1 { color: #4ec9b0; }\n";
  html += "    .info { background: #252526; padding: 15px; border-radius: 5px; margin: 10px 0; }\n";
  html += "    .line { background: #2d2d30; padding: 8px; margin: 5px 0; border-left: 3px solid #007acc; }\n";
  html += "    .empty { color: #858585; font-style: italic; }\n";
  html += "    .button { display: inline-block; padding: 10px 20px; background: #0e639c; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }\n";
  html += "    .button:hover { background: #1177bb; }\n";
  html += "  </style>\n";
  html += "  <script>\n";
  html += "    setTimeout(function(){ location.reload(); }, 3000);\n";
  html += "  </script>\n";
  html += "</head>\n";
  html += "<body>\n";
  html += "  <h1>🔍 Debug - Dados Recebidos da Serial</h1>\n";
  html += "  <div class='info'>\n";
  html += "    <strong>Uptime:</strong> " + String(millis() / 1000) + " segundos<br>\n";
  html += "    <strong>Total bytes recebidos:</strong> " + String(totalBytesReceived) + " bytes<br>\n";
  html += "    <strong>Último byte há:</strong> " + String((millis() - lastByteTime) / 1000) + " segundos<br>\n";
  html += "    <strong>Linhas processadas:</strong> " + String(debugCount) + "<br>\n";
  html += "    <strong>Serial disponível agora:</strong> " + String(arduinoSerial.available()) + " bytes<br>\n";
  html += "    <strong>Buffer atual:</strong> " + String(serialBuffer.length()) + " caracteres<br>\n";
  html += "    <strong>Conteúdo do buffer:</strong> [" + serialBuffer + "]\n";
  html += "  </div>\n";
  html += "  <div class='info'>\n";
  html += "    <strong>📊 Valores atuais:</strong><br>\n";
  html += "    &nbsp;&nbsp;Nitrogênio: " + String(npkData.nitrogenio) + " mg/kg<br>\n";
  html += "    &nbsp;&nbsp;Fósforo: " + String(npkData.fosforo) + " mg/kg<br>\n";
  html += "    &nbsp;&nbsp;Potássio: " + String(npkData.potassio) + " mg/kg<br>\n";
  html += "    &nbsp;&nbsp;Last Update NPK: " + String(npkData.lastUpdate) + " ms<br>\n";
  html += "    &nbsp;&nbsp;Umidade do Solo: " + String(moistureData.percentualUmidade) + " %<br>\n";
  html += "    &nbsp;&nbsp;Last Update Umidade: " + String(moistureData.lastUpdate) + " ms\n";
  html += "  </div>\n";
  html += "  <h2>📋 Últimas 10 linhas recebidas:</h2>\n";
  
  if (debugCount == 0) {
    html += "  <div class='empty'>Nenhum dado recebido ainda. Verifique a conexão serial!</div>\n";
  } else {
    int startIdx = (debugIndex - debugCount + 10) % 10;
    for (int i = 0; i < debugCount; i++) {
      int idx = (startIdx + i) % 10;
      html += "  <div class='line'>" + String(i + 1) + ": " + debugBuffer[idx] + "</div>\n";
    }
  }
  
  html += "  <br>\n";
  html += "  <a href='/' class='button'>🏠 Voltar</a>\n";
  html += "  <a href='/debug' class='button'>🔄 Atualizar</a>\n";
  html += "  <a href='/json' class='button'>📊 JSON</a>\n";
  html += "</body>\n";
  html += "</html>";
  
  server.send(200, "text/html", html);
}

// Página de erro 404
void handleNotFound() {
  String message = "Página não encontrada\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMétodo: ";
  message += (server.method() == HTTP_GET) ? "GET" : "POST";
  
  server.send(404, "text/plain", message);
}
