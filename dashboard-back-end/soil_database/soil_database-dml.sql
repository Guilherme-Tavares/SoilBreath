USE db_soil;

INSERT INTO Usuario (nome, email, senha_hash) 
VALUES ('Teste', 'teste@teste.com', 'hash123');

INSERT INTO Propriedade (nome, usuario_id) 
VALUES ('Fazenda Teste', 1);

-- Inserir culturas com valores ideais de NPK baseados em referências da Embrapa
-- Valores em mg/kg (ou ppm) para solo
-- Formato: (nome, nitrogenio, fosforo, potassio, umidade_ideal%, temperatura_ideal_°C)
INSERT INTO Cultura (nome, nitrogenio, fosforo, potassio, umidade, temperatura) VALUES
('Trigo', 60, 45, 250, 70, 22),
('Milho', 80, 60, 300, 65, 25),
('Soja', 50, 40, 200, 60, 26),
('Arroz', 70, 50, 220, 75, 28),
('Feijão', 55, 35, 180, 65, 24),
('Algodão', 75, 55, 280, 55, 27);

INSERT INTO Solo (identificacao, nitrogenio, fosforo, potassio, umidade, cultura_id, propriedade_id, temperatura) 
VALUES ('Solo 01', 45.5, 28.3, 180.2, 70.5, 1, 1, 29);

INSERT INTO Sensor (id_sensor, solo_id) 
VALUES ('2', 1);

UPDATE Solo
SET nitrogenio = 50, fosforo = 35, potassio = 200
WHERE id=1;

-- Ajustes assistidos por IA
USE db_soil;

-- Limpar tudo
DELETE FROM Sensor WHERE id > 0;
DELETE FROM Solo WHERE id > 0;
DELETE FROM Cultura WHERE id > 0;
DELETE FROM Propriedade WHERE id > 0;
DELETE FROM Usuario WHERE id > 0;

-- Resetar auto_increment
ALTER TABLE Sensor AUTO_INCREMENT = 1;
ALTER TABLE Solo AUTO_INCREMENT = 1;
ALTER TABLE Cultura AUTO_INCREMENT = 1;
ALTER TABLE Propriedade AUTO_INCREMENT = 1;
ALTER TABLE Usuario AUTO_INCREMENT = 1;

-- Inserir usuário (use o hash BCrypt que você gerou)
INSERT INTO Usuario (nome, email, senha_hash) 
VALUES ('Teste Usuario', 'teste@email.com', '[SEU_HASH_BCRYPT_AQUI]');

-- Inserir propriedade
INSERT INTO Propriedade (nome, usuario_id) 
VALUES ('Fazenda Teste', 1);

-- Inserir culturas
INSERT INTO Cultura (nome, nitrogenio, fosforo, potassio, umidade, temperatura) VALUES
('Trigo', 60, 45, 250, 70, 22),
('Milho', 80, 60, 300, 65, 25),
('Soja', 50, 40, 200, 60, 26),
('Arroz', 70, 50, 220, 75, 28),
('Feijão', 55, 35, 180, 65, 24),
('Algodão', 75, 55, 280, 55, 27);

-- Inserir solo
INSERT INTO Solo (identificacao, nitrogenio, fosforo, potassio, umidade, cultura_id, propriedade_id, temperatura) 
VALUES ('Solo 01', 45.5, 28.3, 180.2, 70.5, 1, 1, 29);

-- Inserir sensor
INSERT INTO Sensor (id_sensor, solo_id) 
VALUES ('2', 1);















USE db_soil;

-- Deletar tudo e recomeçar
DELETE FROM Sensor WHERE id > 0;
DELETE FROM Solo WHERE id > 0;
DELETE FROM Cultura WHERE id > 0;
DELETE FROM Propriedade WHERE id > 0;
DELETE FROM Usuario WHERE id > 0;

-- Resetar auto_increment
ALTER TABLE Sensor AUTO_INCREMENT = 1;
ALTER TABLE Solo AUTO_INCREMENT = 1;
ALTER TABLE Cultura AUTO_INCREMENT = 1;
ALTER TABLE Propriedade AUTO_INCREMENT = 1;
ALTER TABLE Usuario AUTO_INCREMENT = 1;

-- Inserir culturas
INSERT INTO Cultura (nome, nitrogenio, fosforo, potassio, umidade, temperatura) VALUES
('Trigo', 60, 45, 250, 70, 22),
('Milho', 80, 60, 300, 65, 25),
('Soja', 50, 40, 200, 60, 26),
('Arroz', 70, 50, 220, 75, 28),
('Feijão', 55, 35, 180, 65, 24),
('Algodão', 75, 55, 280, 55, 27);

-- Criação da propriedade
INSERT INTO Propriedade (nome, usuario_id) 
VALUES ('Fazenda Teste', 1);

INSERT INTO Solo (identificacao, nitrogenio, fosforo, potassio, umidade, cultura_id, propriedade_id, temperatura) 
VALUES ('Solo 01', 45.5, 28.3, 180.2, 70.5, 1, 1, 29);

INSERT INTO Sensor (id_sensor, solo_id) 
VALUES ('2', 1);