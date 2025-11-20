#include <ModbusMaster.h>
#include <SoftwareSerial.h>
#include <DHT.h>

#define RE 8
#define DE 7

// Pinos e configuração do sensor DHT11
#define DHTPIN 10         // Pino digital D10 conectado ao DATA do DHT11
#define DHTTYPE DHT11     // Tipo do sensor: DHT11

// Pinos do sensor de umidade do solo
const int PINO_UMIDADE_ANALOGICO = A0;  // Pino para leitura analógica (AO)

SoftwareSerial mod(2, 3); // RX, TX
ModbusMaster node;
DHT dht(DHTPIN, DHTTYPE); // Inicializa sensor DHT11

void preTransmission() {
  digitalWrite(DE, HIGH);
  digitalWrite(RE, HIGH);
}

void postTransmission() {
  digitalWrite(DE, LOW);
  digitalWrite(RE, LOW);
}

void setup() {
  Serial.begin(9600);
  mod.begin(4800); // Confirmado
  node.begin(1, mod);  // Confirmado

  pinMode(DE, OUTPUT);
  pinMode(RE, OUTPUT);
  digitalWrite(DE, LOW);
  digitalWrite(RE, LOW);

  node.preTransmission(preTransmission);
  node.postTransmission(postTransmission);

  // Inicializa sensor DHT11
  dht.begin();

  Serial.println(F("Iniciando leitura NPK com endereços revisados..."));
  delay(1000);
}

void loop() {
  uint16_t nitrogenio = 0;
  uint16_t fosforo = 0;
  uint16_t potassio = 0;
  int valorAnalogico = 0;
  int percentualUmidade = 0;
  float temperatura = 0.0;
  float umidadeAr = 0.0;


  // --- Leitura do Nitrogênio (Hipótese 2: Addr 0x01) ---
  if (node.readHoldingRegisters(0x0001, 1) == node.ku8MBSuccess) {
    nitrogenio = node.getResponseBuffer(0);
  }
  delay(250);

  // --- Leitura do Fósforo (Endereço Confirmado: Addr 0x10) ---
  if (node.readHoldingRegisters(0x0010, 1) == node.ku8MBSuccess) {
    fosforo = node.getResponseBuffer(0);
  }
  delay(250);

  // --- Leitura do Potássio (Hipótese 1: Addr 0x0F) ---
  if (node.readHoldingRegisters(0x000F, 1) == node.ku8MBSuccess) {
    potassio = node.getResponseBuffer(0);
  }
  delay(250);

  // --- Leitura do Sensor de Umidade do Solo ---
  valorAnalogico = analogRead(PINO_UMIDADE_ANALOGICO);
  // Converte para percentual (solo seco: ~1023, solo úmido: ~300)
  percentualUmidade = map(valorAnalogico, 1023, 300, 0, 100);
  percentualUmidade = constrain(percentualUmidade, 0, 100);

  // --- Leitura do Sensor DHT11 (Temperatura e Umidade do Ar) ---
  umidadeAr = dht.readHumidity();
  temperatura = dht.readTemperature();
  
  // Verifica se a leitura falhou
  if (isnan(umidadeAr) || isnan(temperatura)) {
    // Em caso de erro, mantém valores zerados
    umidadeAr = 0.0;
    temperatura = 0.0;
  }

  // --- Exibição dos Resultados ---
 Serial.println(F("------------------------------"));
  Serial.print(F("Nitrogênio (N) [Addr 0x0001]: ")); 
  Serial.print(nitrogenio); 
  Serial.println(F(" mg/kg"));
  
  Serial.print(F("Fósforo (P)    [Addr 0x0010]: ")); 
  Serial.print(fosforo); 
  Serial.println(F(" mg/kg"));

  Serial.print(F("Potássio (K)   [Addr 0x000F]: ")); 
  Serial.print(potassio); 
  Serial.println(F(" mg/kg"));

  Serial.print(F("Umidade do Solo [A0]:         "));
  Serial.print(percentualUmidade);
  Serial.println(F(" %"));

  Serial.print(F("Temperatura do Ar [D10]:      "));
  Serial.print(temperatura, 1);
  Serial.println(F(" °C"));

  Serial.print(F("Umidade do Ar [D10]:          "));
  Serial.print(umidadeAr, 1);
  Serial.println(F(" %"));

  delay(3000); // Aguarda 3 segundos para o próximo ciclo de leitura
}