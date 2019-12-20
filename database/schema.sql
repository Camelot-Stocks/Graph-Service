CREATE TABLE IF NOT EXISTS stocks (
  stock_id SERIAL PRIMARY KEY,
  stock_name VARCHAR(50),
  symbol CHAR(5) UNIQUE,
  analyst_hold SMALLINT
);

CREATE TABLE IF NOT EXISTS tags (
  tag_id SERIAL PRIMARY KEY,
  tag_name VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS stock_tags (
  stock_tag_id SERIAL PRIMARY KEY,
  tag_id INT REFERENCES tags,
  stock_id INT REFERENCES stocks
);

CREATE TABLE IF NOT EXISTS prices (
  price_id SERIAL PRIMARY KEY,
  stock_id INT REFERENCES stocks,
  ts TIMESTAMPTZ,
  -- break out timestamp into subcomponents for faster querying?
  price NUMERIC(10,2)
);

CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  firstname VARCHAR(35),
  lastname VARCHAR(35),
  balance NUMERIC(12,2)
);

CREATE TABLE IF NOT EXISTS user_stocks (
  user_stock_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users,
  stock_id INT REFERENCES stocks,
  quantity INT
);