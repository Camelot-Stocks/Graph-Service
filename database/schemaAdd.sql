ALTER TABLE prices ADD CONSTRAINT prices_symbol_fk FOREIGN KEY (stock_symbol) REFERENCES stocks;

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
-- this one is not actually immutable and would cause issues in other countries with
-- alternate day of week numbering schema
LANGUAGE sql IMMUTABLE;

CREATE OR REPLACE FUNCTION extract_date(ts timestamptz)
RETURNS date AS
$$select date(ts);$$
-- this one is not actually immutable and would cause issues in other countries with
-- alternate date formatting schema
LANGUAGE sql IMMUTABLE;

-- CREATE INDEX prices_search_idx ON prices (stock_symbol, ts, extract_min(ts), extract_hour(ts), extract_dow(ts));
-- CREATE INDEX prices_search_idx ON prices (stock_symbol, ts DESC, extract_min(ts), extract_hour(ts), extract_dow(ts));
CREATE INDEX prices_search_idx ON prices (stock_symbol, ts DESC, extract_min(ts)) INCLUDE (price);

-- CREATE INDEX prices_search_1yr_idx ON prices (stock_symbol, extract_hour(ts), extract_min(ts));
-- CREATE INDEX prices_search_1yr_idx ON prices (stock_symbol, extract_hour(ts), extract_min(ts), ts DESC);

-- CREATE INDEX prices_search_5yr_idx ON prices (stock_symbol, extract_dow(ts), extract_hour(ts), extract_min(ts), ts DESC) INCLUDE (price);

CREATE MATERIALIZED VIEW prices_1yr_mv AS 
  SELECT stock_symbol, ts, price FROM prices 
  WHERE extract_hour(ts) = 17 AND extract_min(ts) = 0 AND ts > '2018-12-31' 
  GROUP BY stock_symbol, ts, price
  ORDER BY stock_symbol, ts DESC;
-- Add mv daily refresh function process to db

CREATE INDEX prices_1yr_mv_stock_idx ON prices_1yr_mv (stock_symbol);

CREATE MATERIALIZED VIEW prices_5yr_mv AS 
  SELECT stock_symbol, ts, price FROM prices 
  WHERE extract_dow(ts) = 1 AND extract_hour(ts) = 17 AND extract_min(ts) = 0 AND ts > '2014-12-31' 
  GROUP BY stock_symbol, ts, price
  ORDER BY stock_symbol, ts DESC;
-- Add mv weekly refresh function process to db

CREATE INDEX prices_5yr_mv_stock_idx ON prices_5yr_mv (stock_symbol);

