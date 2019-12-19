CREATE KEYSPACE IF NOT EXISTS stockHistory
    WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 2};
    -- WITH replication = {'class': 'NetworkTopologyStrategy', 'DC1' : 2, 'DC2' : 2};

CREATE TABLE stocks (
  stockId INT,
  name VARCHAR(50),
  symbol CHAR(5),
  analystHold SMALLINT,
  robinhoodOwners INT,
  tags list<VARCHAR(25)>,
  PRIMARY KEY (stockId, symbol, tags)
);

CREATE TABLE prices (
  priceId INT,
  stockID INT,
  ts TIMESTAMP,
  price DECIMAL(7,2),
  PRIMARY KEY (stockId, ts)
);