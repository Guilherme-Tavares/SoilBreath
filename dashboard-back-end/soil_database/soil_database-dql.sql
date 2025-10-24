USE soil_database;

SELECT s.soil_id AS 'Soil', s.nitrogen AS 'Nitrogen', s.phosphorus AS 'Phosphorus', s.potassium AS 'Potassium', s.moisture AS 'Moisture'
FROM soil s;