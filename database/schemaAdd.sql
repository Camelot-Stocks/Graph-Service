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

CREATE INDEX prices_search_idx ON prices (stock_symbol, ts, extract_min(ts), extract_hour(ts), extract_dow(ts));

CREATE INDEX prices_search_1yr_idx ON prices (stock_symbol, extract_hour(ts), extract_min(ts));

CREATE INDEX prices_search_5yr_idx ON prices (stock_symbol, extract_dow(ts), extract_hour(ts), extract_min(ts));