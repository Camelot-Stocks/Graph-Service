CREATE KEYSPACE IF NOT EXISTS stockHistory
    WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 3};
    -- WITH replication = {'class': 'NetworkTopologyStrategy', 'DC1' : 2, 'DC2' : 2};

USE stockHistory;

CREATE TABLE IF NOT EXISTS stocks (
  symbol VARCHAR,
  stock_name VARCHAR,
  analyst_hold SMALLINT,
  owners INT,
  PRIMARY KEY (symbol)
);

CREATE TABLE IF NOT EXISTS stock_tags (
  stock_tag_id INT,
  symbol VARCHAR,
  tag VARCHAR,
  PRIMARY KEY (symbol, tag)
);

CREATE TABLE IF NOT EXISTS prices (
  price_id INT,
  symbol VARCHAR,
  ts TIMESTAMP,
  price DECIMAL,
  PRIMARY KEY (symbol, ts)
);
-- break out timestamp into subcomponents to cluster for faster querying?

CREATE TABLE IF NOT EXISTS users (
  user_id INT,
  firstname VARCHAR,
  lastname VARCHAR,
  balance DECIMAL,
  stocks map<INT, INT>,
  PRIMARY KEY (user_id)
);

