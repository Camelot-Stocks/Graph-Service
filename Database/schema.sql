CREATE DATABASE IF NOT EXISTS stockHistory;

CREATE TABLE stocks (
  stockId SERIAL PRIMARY KEY,
  stockName VARCHAR(50),
  symbol CHAR(5),
  analystHold SMALLINT
);

CREATE TABLE tags (
  tagId SERIAL PRIMARY KEY,
  tagName VARCHAR(50)
);

CREATE TABLE stockTags (
  stockTagId SERIAL PRIMARY KEY,
  tagId INT REFERENCES tags,
  stockId INT REFERENCES stocks
);

CREATE TABLE prices (
  priceId SERIAL PRIMARY KEY,
  stockId INT REFERENCES stocks,
  ts TIMESTAMPTZ,
  -- break out timestamp into subcomponents for faster querying?
  price NUMERIC(10,2)
);

CREATE TABLE users (
  userId SERIAL PRIMARY KEY,
  firstName VARCHAR(35),
  lastName VARCHAR(35),
  balance NUMERIC(12,2)
)

CREATE TABLE userStocks (
  userStockId SERIAL PRIMARY KEY,
  userId INT REFERENCES users,
  stockId INT REFERENCES stocks,
  quantity INT
)