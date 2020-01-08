const { db } = require('../database/index.js');

let pool;
(async () => { pool = await db; })();

const priceQueryData = {
  '1D': "SELECT price FROM prices WHERE stock_symbol=$1 AND ts > '2019-12-30'",
  '1W': "SELECT price FROM prices WHERE stock_symbol=$1 AND ts > '2019-12-24' AND extract_min(ts) IN (0, 10, 20, 30, 40, 50)",
  '1M': "SELECT price FROM prices WHERE stock_symbol=$1 AND ts > '2019-11-30' AND extract_min(ts) = 0",
  '3M': "SELECT price FROM prices WHERE stock_symbol=$1 AND ts > '2019-09-30' AND extract_min(ts) = 0",
  '1Y': 'SELECT price FROM prices_1yr_mv WHERE stock_symbol=$1;',
  '5Y': 'SELECT price FROM prices_5yr_mv WHERE stock_symbol=$1;',
};

const getStockHistory = async (symbol, term) => {
  // TODO - can these three combined queries be moved to a pg function for one server query?
  // TODO - prepare queries?
  const queries = [];

  const queryValues = [symbol];

  // TODO - vulnerable to injection attack through term?
  queries.push(pool.query({
    text: priceQueryData[term],
    values: queryValues,
  }));

  queries.push(pool.query({
    text: 'SELECT tag_name FROM tags t JOIN stock_tags s ON t.tag_id=s.tag_id WHERE stock_symbol=$1;',
    values: queryValues,
  }));

  queries.push(pool.query({
    text: 'SELECT stock_name,owners,analyst_hold FROM stocks WHERE stock_symbol=$1;',
    values: queryValues,
  }));

  const [priceHistoryRes, tagRes, stockRes] = await Promise.all(queries);
  // eslint-disable-next-line camelcase
  const { owners, analyst_hold, stock_name } = stockRes.rows[0];

  const stockHistory = {
    // TODO - vulnerable to injection attack through term?
    [`historicPrice${term}`]: priceHistoryRes.rows.map((row) => row.price),
    tags: tagRes.rows.map((row) => row.tag_name),
    symbol,
    owners,
    analystHold: analyst_hold,
    name: stock_name,
  };

  return stockHistory;
};

const addStockHistory = async (prices) => {
  // TODO - prepare query
  const queries = [];

  for (let i = 0; i < prices.length; i += 1) {
    const text = 'INSERT INTO prices(stock_symbol, ts, price) VALUES($1, $2, $3)';
    const { symbol, timestamp, price } = prices[i];
    queries.push(pool.query({
      text,
      values: [symbol, timestamp, price],
    }));
  }

  await Promise.all(queries);
  return queries.length;
};

module.exports = {
  getStockHistory,
  addStockHistory,
  priceQueryData,
};
