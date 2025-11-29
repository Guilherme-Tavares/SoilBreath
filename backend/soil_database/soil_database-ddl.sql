-- =====================================================
-- SOIL BRIEF - DATA DEFINITION LANGUAGE (DDL)
-- =====================================================
-- Este arquivo contém a estrutura do banco de dados.
-- Ordem de criação: respeitando dependências de FK
-- =====================================================

-- Criar banco de dados
DROP DATABASE IF EXISTS db_soil;
CREATE DATABASE db_soil;

USE db_soil;

-- =====================================================
-- TABELA: Usuario
-- Descrição: Armazena informações dos usuários do sistema
-- =====================================================
CREATE TABLE Usuario(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255),
    email VARCHAR(255),
    senha_hash VARCHAR(255)
);

-- =====================================================
-- TABELA: Propriedade
-- Descrição: Propriedades rurais vinculadas aos usuários
-- Dependências: Usuario
-- =====================================================
CREATE TABLE Propriedade(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255),
    usuario_id INT NOT NULL,
    FOREIGN KEY(usuario_id) REFERENCES Usuario(id)
);

-- =====================================================
-- TABELA: Cultura
-- Descrição: Tipos de culturas agrícolas com valores ideais de NPK
-- Valores baseados em referências da Embrapa (mg/kg ou ppm)
-- =====================================================
CREATE TABLE Cultura(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255),
    nitrogenio DOUBLE,
    fosforo DOUBLE,
    potassio DOUBLE,
    umidade DOUBLE,
    temperatura DOUBLE
);

-- =====================================================
-- TABELA: Solo
-- Descrição: Solos monitorados com leituras atuais de NPK
-- Dependências: Cultura, Propriedade
-- =====================================================
CREATE TABLE Solo(
    id INT PRIMARY KEY AUTO_INCREMENT,
    identificacao VARCHAR(50),
    nitrogenio DOUBLE,
    fosforo DOUBLE,
    potassio DOUBLE,
    umidade DOUBLE,
    temperatura DOUBLE,
    cultura_id INT,
    propriedade_id INT NOT NULL,
    FOREIGN KEY(cultura_id) REFERENCES Cultura(id),
    FOREIGN KEY(propriedade_id) REFERENCES Propriedade(id)
);

-- =====================================================
-- TABELA: Sensor
-- Descrição: Sensores físicos vinculados aos solos
-- Dependências: Solo
-- =====================================================
CREATE TABLE Sensor(
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_sensor VARCHAR(10),
    solo_id INT,
    FOREIGN KEY(solo_id) REFERENCES Solo(id)
);

-- =====================================================
-- TABELA: Historico
-- Descrição: Registros históricos diários de leituras médias
-- Dependências: Solo
-- Restrições: Um registro por dia por solo (UNIQUE)
-- =====================================================
CREATE TABLE Historico(
    id INT PRIMARY KEY AUTO_INCREMENT,
    data DATE NOT NULL,
    nitrogenio_medio DOUBLE NOT NULL,
    fosforo_medio DOUBLE NOT NULL,
    potassio_medio DOUBLE NOT NULL,
    umidade_media DOUBLE NOT NULL,
    temperatura_media DOUBLE NOT NULL,
    quantidade_leituras INT NOT NULL,
    solo_id INT NOT NULL,
    FOREIGN KEY(solo_id) REFERENCES Solo(id),
    UNIQUE KEY unique_date_solo (data, solo_id)
);
