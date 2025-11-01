CREATE DATABASE db_soil;

USE db_soil;

CREATE TABLE Usuario(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255),
    email VARCHAR(255),
    senha_hash VARCHAR(255)
);

CREATE TABLE Propriedade(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255),
    usuario_id INT NOT NULL,
    FOREIGN KEY(usuario_id) REFERENCES Usuario(id)
);

CREATE TABLE Cultura(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255),
    fosforo DOUBLE,
    potassio DOUBLE,
    nitrogenio DOUBLE,
    umidade DOUBLE
);

CREATE TABLE Solo(
    id INT PRIMARY KEY AUTO_INCREMENT,
    identificacao VARCHAR(50),
    fosforo DOUBLE,
    potassio DOUBLE,
    nitrogenio DOUBLE,
    umidade DOUBLE,
    cultura_id INT,
    FOREIGN KEY(cultura_id) REFERENCES Cultura(id),
    propriedade_id INT NOT NULL,
    FOREIGN KEY(propriedade_id) REFERENCES Propriedade(id)
);

CREATE TABLE Sensor(
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_sensor VARCHAR(10),
    solo_id INT,
    FOREIGN KEY(solo_id) REFERENCES Solo(id)
);
