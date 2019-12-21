CREATE KEYSPACE IF NOT EXISTS stockHistory
    WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 3};
    -- WITH replication = {'class': 'NetworkTopologyStrategy', 'DC1' : 2, 'DC2' : 2};

CREATE TABLE stocks (
  symbol CHAR(5),
  stock_name VARCHAR(50),
  analyst_hold SMALLINT,
  robinhood_owners INT,
  tags list<VARCHAR(50)>,
  PRIMARY KEY (symbol, tags)
);

-- separate stocktags table focused on that query

CREATE TABLE prices (
  price_id INT,
  symbol CHAR(5),
  ts TIMESTAMP,
  -- break out timestamp into subcomponents to cluster for faster querying?
  price DECIMAL(10,2),
  PRIMARY KEY (symbol, ts)
);

CREATE TABLE users (
  user_id INT,
  firstname VARCHAR(35),
  lastname VARCHAR(35),
  balance NUMERIC(12,2),
  stocks map<INT, INT>,
  PRIMARY KEY (user_id)
)