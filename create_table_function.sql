
-- SQL function to create the larson_juhl_catalog table
CREATE OR REPLACE FUNCTION create_larson_juhl_catalog_table()
RETURNS void AS 1908
BEGIN
  CREATE TABLE IF NOT EXISTS larson_juhl_catalog (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    hex_color TEXT NOT NULL,
    price DECIMAL(10,4) NOT NULL,
    code TEXT NOT NULL,
    crescent_code TEXT,
    description TEXT,
    category TEXT,
    manufacturer TEXT NOT NULL
  );
END;
1908 LANGUAGE plpgsql;

