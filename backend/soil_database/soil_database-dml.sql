-- =====================================================
-- SOIL BRIEF - DATA MANIPULATION LANGUAGE (DML)
-- =====================================================
-- Este arquivo contém os dados iniciais para o sistema.
-- Ordem de inserção: respeitando dependências de FK
-- Execute este arquivo após executar o soil_database-ddl.sql
-- =====================================================

USE db_soil;

-- =====================================================
-- INSERÇÃO: Usuario
-- Descrição: Usuário do sistema
-- =====================================================
INSERT INTO Usuario (nome, email, senha_hash) 
VALUES ('Guilherme Tavares', 'guilherme.tavares@soilbrief.com', '$2a$11$462toWiYYzKdmXtAXirERuFZZiu8vTvTNQkVfzbs9BUAZdyQs5QUy');

-- =====================================================
-- INSERÇÃO: Propriedade
-- Descrição: Propriedade rural do usuário
-- Dependências: Usuario (id=1)
-- =====================================================
INSERT INTO Propriedade (nome, usuario_id) 
VALUES ('Serra Azul', 1);

-- =====================================================
-- INSERÇÃO: Cultura
-- Descrição: Culturas agrícolas com valores ideais de NPK
-- Valores em mg/kg (ou ppm) para solo
-- Formato: (nome, nitrogenio, fosforo, potassio, umidade_ideal%, temperatura_ideal_°C)
-- Referências: Embrapa
-- =====================================================
INSERT INTO Cultura (nome, nitrogenio, fosforo, potassio, umidade, temperatura) VALUES
('Trigo', 60, 45, 250, 70, 22),
('Milho', 80, 60, 300, 65, 25),
('Soja', 50, 40, 200, 60, 26),
('Arroz', 70, 50, 220, 75, 28),
('Feijão', 55, 35, 180, 65, 24),
('Algodão', 75, 55, 280, 55, 27);

-- =====================================================
-- INSERÇÃO: Solo
-- Descrição: Solo monitorado da propriedade
-- Dependências: Cultura (id=1 - Trigo), Propriedade (id=1 - Serra Azul)
-- =====================================================
INSERT INTO Solo (identificacao, nitrogenio, fosforo, potassio, umidade, cultura_id, propriedade_id, temperatura) 
VALUES ('Lavoura', 45.5, 28.3, 180.2, 70.5, 1, 1, 29);

-- =====================================================
-- INSERÇÃO: Sensor
-- Descrição: Sensores físicos vinculados ao solo
-- Dependências: Solo (id=1 - Lavoura)
-- =====================================================
INSERT INTO Sensor (id_sensor, solo_id) VALUES
('1', 1),
('2', 1),
('3', 1);

-- =====================================================
-- INSERÇÃO: Historico
-- Descrição: Dados históricos de leituras para testes
-- Período: Janeiro/2024 a Novembro/2025 (94 registros)
-- Dependências: Solo (id=1 - Lavoura)
-- =====================================================

-- Janeiro 2024
INSERT INTO Historico (data, nitrogenio_medio, fosforo_medio, potassio_medio, umidade_media, temperatura_media, quantidade_leituras, solo_id) VALUES
('2024-01-05', 52, 38, 210, 68, 24, 200, 1),
('2024-01-12', 54, 40, 215, 70, 25, 200, 1),
('2024-01-20', 51, 37, 208, 67, 23, 200, 1),
('2024-01-28', 55, 41, 220, 72, 26, 200, 1);

-- Fevereiro 2024
INSERT INTO Historico (data, nitrogenio_medio, fosforo_medio, potassio_medio, umidade_media, temperatura_media, quantidade_leituras, solo_id) VALUES
('2024-02-03', 53, 39, 212, 69, 25, 200, 1),
('2024-02-14', 56, 42, 218, 71, 27, 200, 1),
('2024-02-25', 52, 38, 210, 68, 24, 200, 1);

-- Março 2024
INSERT INTO Historico (data, nitrogenio_medio, fosforo_medio, potassio_medio, umidade_media, temperatura_media, quantidade_leituras, solo_id) VALUES
('2024-03-10', 58, 44, 225, 73, 28, 200, 1),
('2024-03-18', 57, 43, 222, 72, 27, 200, 1),
('2024-03-25', 59, 45, 228, 74, 29, 200, 1);

-- Abril 2024
INSERT INTO Historico (data, nitrogenio_medio, fosforo_medio, potassio_medio, umidade_media, temperatura_media, quantidade_leituras, solo_id) VALUES
('2024-04-05', 60, 46, 230, 75, 30, 200, 1),
('2024-04-15', 61, 47, 233, 76, 31, 200, 1),
('2024-04-24', 59, 45, 228, 74, 29, 200, 1);

-- Maio 2024
INSERT INTO Historico (data, nitrogenio_medio, fosforo_medio, potassio_medio, umidade_media, temperatura_media, quantidade_leituras, solo_id) VALUES
('2024-05-08', 62, 48, 235, 77, 30, 200, 1),
('2024-05-16', 63, 49, 238, 78, 31, 200, 1),
('2024-05-28', 61, 47, 232, 76, 29, 200, 1);

-- Junho 2024
INSERT INTO Historico (data, nitrogenio_medio, fosforo_medio, potassio_medio, umidade_media, temperatura_media, quantidade_leituras, solo_id) VALUES
('2024-06-05', 58, 44, 225, 73, 27, 200, 1),
('2024-06-14', 57, 43, 222, 72, 26, 200, 1),
('2024-06-23', 56, 42, 220, 71, 25, 200, 1);

-- Julho 2024
INSERT INTO Historico (data, nitrogenio_medio, fosforo_medio, potassio_medio, umidade_media, temperatura_media, quantidade_leituras, solo_id) VALUES
('2024-07-02', 55, 41, 218, 70, 24, 200, 1),
('2024-07-12', 54, 40, 215, 69, 23, 200, 1),
('2024-07-22', 53, 39, 212, 68, 22, 200, 1);

-- Agosto 2024
INSERT INTO Historico (data, nitrogenio_medio, fosforo_medio, potassio_medio, umidade_media, temperatura_media, quantidade_leituras, solo_id) VALUES
('2024-08-01', 52, 38, 210, 67, 23, 200, 1),
('2024-08-10', 53, 39, 213, 68, 24, 200, 1),
('2024-08-20', 54, 40, 216, 69, 25, 200, 1),
('2024-08-30', 55, 41, 219, 70, 26, 200, 1);

-- Setembro 2024
INSERT INTO Historico (data, nitrogenio_medio, fosforo_medio, potassio_medio, umidade_media, temperatura_media, quantidade_leituras, solo_id) VALUES
('2024-09-05', 56, 42, 221, 71, 27, 200, 1),
('2024-09-15', 57, 43, 224, 72, 28, 200, 1),
('2024-09-25', 58, 44, 227, 73, 29, 200, 1);

-- Outubro 2024
INSERT INTO Historico (data, nitrogenio_medio, fosforo_medio, potassio_medio, umidade_media, temperatura_media, quantidade_leituras, solo_id) VALUES
('2024-10-03', 59, 45, 229, 74, 30, 200, 1),
('2024-10-12', 60, 46, 231, 75, 31, 200, 1),
('2024-10-21', 61, 47, 234, 76, 30, 200, 1),
('2024-10-30', 60, 46, 232, 75, 29, 200, 1);

-- Novembro 2024
INSERT INTO Historico (data, nitrogenio_medio, fosforo_medio, potassio_medio, umidade_media, temperatura_media, quantidade_leituras, solo_id) VALUES
('2024-11-08', 59, 45, 230, 74, 28, 200, 1),
('2024-11-18', 58, 44, 228, 73, 27, 200, 1),
('2024-11-27', 57, 43, 225, 72, 26, 200, 1);

-- Dezembro 2024
INSERT INTO Historico (data, nitrogenio_medio, fosforo_medio, potassio_medio, umidade_media, temperatura_media, quantidade_leituras, solo_id) VALUES
('2024-12-05', 56, 42, 222, 71, 25, 200, 1),
('2024-12-15', 55, 41, 220, 70, 24, 200, 1),
('2024-12-24', 54, 40, 218, 69, 23, 200, 1);

-- Janeiro 2025
INSERT INTO Historico (data, nitrogenio_medio, fosforo_medio, potassio_medio, umidade_media, temperatura_media, quantidade_leituras, solo_id) VALUES
('2025-01-04', 53, 39, 215, 68, 24, 200, 1),
('2025-01-13', 54, 40, 217, 69, 25, 200, 1),
('2025-01-22', 55, 41, 220, 70, 26, 200, 1);

-- Fevereiro 2025
INSERT INTO Historico (data, nitrogenio_medio, fosforo_medio, potassio_medio, umidade_media, temperatura_media, quantidade_leituras, solo_id) VALUES
('2025-02-02', 56, 42, 222, 71, 27, 200, 1),
('2025-02-11', 57, 43, 225, 72, 28, 200, 1),
('2025-02-20', 58, 44, 227, 73, 29, 200, 1);

-- Março 2025
INSERT INTO Historico (data, nitrogenio_medio, fosforo_medio, potassio_medio, umidade_media, temperatura_media, quantidade_leituras, solo_id) VALUES
('2025-03-05', 59, 45, 230, 74, 30, 200, 1),
('2025-03-14', 60, 46, 232, 75, 31, 200, 1),
('2025-03-23', 61, 47, 235, 76, 30, 200, 1);

-- Abril 2025
INSERT INTO Historico (data, nitrogenio_medio, fosforo_medio, potassio_medio, umidade_media, temperatura_media, quantidade_leituras, solo_id) VALUES
('2025-04-02', 62, 48, 237, 77, 29, 200, 1),
('2025-04-12', 63, 49, 240, 78, 28, 200, 1),
('2025-04-21', 62, 48, 238, 77, 27, 200, 1);

-- Maio 2025
INSERT INTO Historico (data, nitrogenio_medio, fosforo_medio, potassio_medio, umidade_media, temperatura_media, quantidade_leituras, solo_id) VALUES
('2025-05-01', 61, 47, 235, 76, 28, 200, 1),
('2025-05-10', 60, 46, 233, 75, 29, 200, 1),
('2025-05-19', 59, 45, 230, 74, 30, 200, 1);

-- Junho 2025
INSERT INTO Historico (data, nitrogenio_medio, fosforo_medio, potassio_medio, umidade_media, temperatura_media, quantidade_leituras, solo_id) VALUES
('2025-06-03', 58, 44, 228, 73, 29, 200, 1),
('2025-06-12', 57, 43, 225, 72, 28, 200, 1),
('2025-06-21', 56, 42, 222, 71, 27, 200, 1);

-- Julho 2025
INSERT INTO Historico (data, nitrogenio_medio, fosforo_medio, potassio_medio, umidade_media, temperatura_media, quantidade_leituras, solo_id) VALUES
('2025-07-01', 55, 41, 220, 70, 26, 200, 1),
('2025-07-10', 54, 40, 217, 69, 25, 200, 1),
('2025-07-19', 53, 39, 215, 68, 24, 200, 1);

-- Agosto 2025
INSERT INTO Historico (data, nitrogenio_medio, fosforo_medio, potassio_medio, umidade_media, temperatura_media, quantidade_leituras, solo_id) VALUES
('2025-08-02', 54, 40, 218, 69, 25, 200, 1),
('2025-08-11', 55, 41, 221, 70, 26, 200, 1),
('2025-08-20', 56, 42, 224, 71, 27, 200, 1);

-- Setembro 2025
INSERT INTO Historico (data, nitrogenio_medio, fosforo_medio, potassio_medio, umidade_media, temperatura_media, quantidade_leituras, solo_id) VALUES
('2025-09-04', 57, 43, 226, 72, 28, 200, 1),
('2025-09-13', 58, 44, 229, 73, 29, 200, 1),
('2025-09-22', 59, 45, 231, 74, 30, 200, 1);

-- Outubro 2025
INSERT INTO Historico (data, nitrogenio_medio, fosforo_medio, potassio_medio, umidade_media, temperatura_media, quantidade_leituras, solo_id) VALUES
('2025-10-02', 60, 46, 234, 75, 29, 200, 1),
('2025-10-11', 61, 47, 236, 76, 28, 200, 1),
('2025-10-20', 60, 46, 233, 75, 27, 200, 1);

-- Novembro 2025
INSERT INTO Historico (data, nitrogenio_medio, fosforo_medio, potassio_medio, umidade_media, temperatura_media, quantidade_leituras, solo_id) VALUES
('2025-11-05', 59, 45, 231, 74, 26, 200, 1),
('2025-11-14', 58, 44, 228, 73, 25, 200, 1),
('2025-11-23', 57, 43, 226, 72, 24, 200, 1),
('2025-11-27', 56, 42, 223, 71, 23, 200, 1);