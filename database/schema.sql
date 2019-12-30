CREATE TABLE IF NOT EXISTS stocks (
  -- stock_id SERIAL,
  stock_symbol CHAR(5) PRIMARY KEY,
  stock_name VARCHAR(50),
  owners INT,
  analyst_hold SMALLINT
);

CREATE TABLE IF NOT EXISTS tags (
  tag_id SERIAL PRIMARY KEY,
  tag_name VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS stock_tags (
  stock_tag_id SERIAL PRIMARY KEY,
  tag_id INT REFERENCES tags,
  stock_symbol CHAR(5) REFERENCES stocks
);

CREATE TABLE IF NOT EXISTS prices (
  price_id SERIAL PRIMARY KEY,
  stock_symbol CHAR(5) REFERENCES stocks,
  ts TIMESTAMPTZ,
  -- break out timestamp into subcomponents for faster querying?
  price NUMERIC(10,2)
);
-- CREATE INDEX ON prices (stock_symbol);

CREATE OR REPLACE FUNCTION extract_min(ts timestamptz)
RETURNS double precision AS
$$select extract(minute from ts);$$
LANGUAGE sql IMMUTABLE;

CREATE OR REPLACE FUNCTION extract_hour(ts timestamptz)
RETURNS double precision AS
$$select extract(hour from ts);$$
LANGUAGE sql IMMUTABLE;

CREATE OR REPLACE FUNCTION extract_dow(ts timestamptz)
RETURNS double precision AS
$$select extract(dow from ts);$$
LANGUAGE sql IMMUTABLE;
-- this one is not actually immutable and would cause issues in other countries with
-- alternate day of week numbering schema

CREATE INDEX prices_search_idx ON prices (stock_symbol, ts, extract_min(ts), extract_hour(ts), extract_dow(ts));

CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  firstname VARCHAR(35),
  lastname VARCHAR(35),
  balance NUMERIC(12,2)
);

CREATE TABLE IF NOT EXISTS user_stocks (
  user_stock_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users,
  stock_symbol CHAR(5) REFERENCES stocks,
  quantity INT
);
