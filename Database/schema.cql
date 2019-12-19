CREATE KEYSPACE IF NOT EXISTS stockHistory
    WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 2};
    -- WITH replication = {'class': 'NetworkTopologyStrategy', 'DC1' : 2, 'DC2' : 2};

CREATE TABLE stocks (
  stockId INT,
  stockName VARCHAR(50),
  symbol CHAR(5),
  analystHold SMALLINT,
  robinhoodOwners INT,
  tags list<VARCHAR(50)>,
  PRIMARY KEY (stockId, symbol, tags)
);

CREATE TABLE prices (
  priceId INT,
  stockId INT,
  ts TIMESTAMP,
  -- break out timestamp into subcomponents to cluster for faster querying?
  price DECIMAL(10,2),
  PRIMARY KEY (priceId, stockId, ts)
);