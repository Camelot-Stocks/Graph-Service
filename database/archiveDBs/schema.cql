DROP KEYSPACE IF EXISTS stock_history;

CREATE KEYSPACE IF NOT EXISTS stock_history
    WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 1};
    -- WITH replication = {'class': 'NetworkTopologyStrategy', 'DC1' : 2, 'DC2' : 2};

USE stock_history;

CREATE TABLE stocks (
  symbol VARCHAR,
  stock_name VARCHAR,
  analyst_hold SMALLINT,
  owners INT,
  PRIMARY KEY (symbol)
);

CREATE TABLE stock_tags (
  symbol VARCHAR,
  tag VARCHAR,
  PRIMARY KEY (symbol, tag)
);

CREATE TABLE prices (
  symbol VARCHAR,
  ts TIMESTAMP,
  price DECIMAL,
  filter10min BOOLEAN,
  filter1hr BOOLEAN,
  filter1day BOOLEAN,
  filter7day BOOLEAN,
  PRIMARY KEY (symbol, ts)
) WITH CLUSTERING ORDER BY (ts DESC);
CREATE INDEX ON stock_history.prices (filter7day);
CREATE INDEX ON stock_history.prices (filter1day);
CREATE INDEX ON stock_history.prices (filter1hr);
CREATE INDEX ON stock_history.prices (filter10min);

CREATE TABLE users (
  user_id UUID,
  firstname VARCHAR,
  lastname VARCHAR,
  balance DECIMAL,
  stocks map<VARCHAR, INT>,
  PRIMARY KEY (user_id)
);

