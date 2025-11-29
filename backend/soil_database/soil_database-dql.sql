-- =====================================================
-- SOIL BRIEF - DATA QUERY LANGUAGE (DQL)
-- =====================================================
-- Este arquivo contém consultas úteis para visualizar dados.
-- Execute este arquivo após executar DDL e DML.
-- =====================================================

USE db_soil;

-- =====================================================
-- CONSULTA: Todos os usuários
-- =====================================================
SELECT * FROM Usuario;

-- =====================================================
-- CONSULTA: Todas as propriedades com dados do usuário
-- =====================================================
SELECT 
    p.id AS propriedade_id,
    p.nome AS propriedade,
    u.nome AS usuario,
    u.email
FROM Propriedade p
INNER JOIN Usuario u ON p.usuario_id = u.id;

-- =====================================================
-- CONSULTA: Todas as culturas
-- =====================================================
SELECT * FROM Cultura;

-- =====================================================
-- CONSULTA: Todos os solos com dados completos
-- =====================================================
SELECT 
    s.id AS solo_id,
    s.identificacao,
    s.nitrogenio,
    s.fosforo,
    s.potassio,
    s.umidade,
    s.temperatura,
    c.nome AS cultura,
    p.nome AS propriedade,
    u.nome AS usuario
FROM Solo s
LEFT JOIN Cultura c ON s.cultura_id = c.id
INNER JOIN Propriedade p ON s.propriedade_id = p.id
INNER JOIN Usuario u ON p.usuario_id = u.id;

-- =====================================================
-- CONSULTA: Todos os sensores com informações do solo
-- =====================================================
SELECT 
    sen.id AS sensor_id,
    sen.id_sensor,
    s.identificacao AS solo,
    p.nome AS propriedade
FROM Sensor sen
INNER JOIN Solo s ON sen.solo_id = s.id
INNER JOIN Propriedade p ON s.propriedade_id = p.id;

-- =====================================================
-- CONSULTA: Histórico completo (todos os registros)
-- =====================================================
SELECT 
    h.id,
    h.data,
    h.nitrogenio_medio AS N,
    h.fosforo_medio AS P,
    h.potassio_medio AS K,
    h.umidade_media AS umidade,
    h.temperatura_media AS temp,
    h.quantidade_leituras AS leituras,
    s.identificacao AS solo,
    p.nome AS propriedade
FROM Historico h
INNER JOIN Solo s ON h.solo_id = s.id
INNER JOIN Propriedade p ON s.propriedade_id = p.id
ORDER BY h.data DESC;

-- =====================================================
-- CONSULTA: Registros históricos do último mês
-- =====================================================
SELECT 
    h.data,
    h.nitrogenio_medio AS N,
    h.fosforo_medio AS P,
    h.potassio_medio AS K,
    h.umidade_media AS umidade,
    h.temperatura_media AS temp,
    s.identificacao AS solo
FROM Historico h
INNER JOIN Solo s ON h.solo_id = s.id
WHERE h.data >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
ORDER BY h.data DESC;

-- =====================================================
-- CONSULTA: Médias mensais de NPK (agrupado por mês/ano)
-- =====================================================
SELECT 
    YEAR(h.data) AS ano,
    MONTH(h.data) AS mes,
    ROUND(AVG(h.nitrogenio_medio), 2) AS N_medio,
    ROUND(AVG(h.fosforo_medio), 2) AS P_medio,
    ROUND(AVG(h.potassio_medio), 2) AS K_medio,
    ROUND(AVG(h.umidade_media), 2) AS umidade_media,
    ROUND(AVG(h.temperatura_media), 2) AS temp_media,
    COUNT(*) AS registros,
    s.identificacao AS solo
FROM Historico h
INNER JOIN Solo s ON h.solo_id = s.id
GROUP BY YEAR(h.data), MONTH(h.data), s.id
ORDER BY ano DESC, mes DESC;

-- =====================================================
-- CONSULTA: Comparação valores atuais vs ideais da cultura
-- =====================================================
SELECT 
    s.identificacao AS solo,
    c.nome AS cultura,
    s.nitrogenio AS N_atual,
    c.nitrogenio AS N_ideal,
    (s.nitrogenio - c.nitrogenio) AS N_diferenca,
    s.fosforo AS P_atual,
    c.fosforo AS P_ideal,
    (s.fosforo - c.fosforo) AS P_diferenca,
    s.potassio AS K_atual,
    c.potassio AS K_ideal,
    (s.potassio - c.potassio) AS K_diferenca,
    s.umidade AS umidade_atual,
    c.umidade AS umidade_ideal,
    s.temperatura AS temp_atual,
    c.temperatura AS temp_ideal
FROM Solo s
LEFT JOIN Cultura c ON s.cultura_id = c.id;

-- =====================================================
-- CONSULTA: Quantidade de registros históricos por solo
-- =====================================================
SELECT 
    s.identificacao AS solo,
    COUNT(h.id) AS total_registros,
    MIN(h.data) AS primeiro_registro,
    MAX(h.data) AS ultimo_registro
FROM Solo s
LEFT JOIN Historico h ON s.id = h.solo_id
GROUP BY s.id;