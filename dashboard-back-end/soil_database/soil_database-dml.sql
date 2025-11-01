USE db_soil;

INSERT INTO Usuario (nome, email, senha_hash) 
VALUES ('Teste', 'teste@teste.com', 'hash123');

INSERT INTO Propriedade (nome, usuario_id) 
VALUES ('Fazenda Teste', 1);

INSERT INTO Cultura (nome, nitrogenio, fosforo, potassio, umidade) 
VALUES ('Trigo', 50, 35, 200, 100);

INSERT INTO Solo (identificacao, nitrogenio, fosforo, potassio, umidade, cultura_id, propriedade_id) 
VALUES ('Solo 01', 45.5, 28.3, 180.2, 70.5, 1, 1);

INSERT INTO Sensor (id_sensor, solo_id) 
VALUES ('1', 1);

UPDATE Solo
SET nitrogenio = 50, fosforo = 35, potassio = 200
WHERE id=1;