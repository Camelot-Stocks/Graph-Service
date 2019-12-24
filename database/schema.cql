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
  PRIMARY KEY (symbol, ts)
) WITH CLUSTERING ORDER BY (ts DESC);
-- break out timestamp into subcomponents to cluster for faster querying?

CREATE TABLE users (
  user_id UUID,
  firstname VARCHAR,
  lastname VARCHAR,
  balance DECIMAL,
  stocks map<VARCHAR, INT>,
  PRIMARY KEY (user_id)
);

