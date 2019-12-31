const { db } = require('../database/index.js');


const getStockHistory = async (symbol, term) => {
  // TODO - can these three combined queries be moved to a pg function for one server query?
  // TODO - prepare queries?
  const pool = await db;
  const queries = [];

  const priceQueryData = {
    '1D': " AND ts > '2019-12-30'",
    '1W': " AND ts > '2019-12-24' AND extract_min(ts) IN (0, 10, 20, 30, 40, 50)",
    '1M': " AND ts > '2019-11-30' AND extract_min(ts) = 0",
    '3M': " AND ts > '2019-09-30' AND extract_min(ts) = 0",
    '1Y': " AND extract_hour(ts) = 17 AND extract_min(ts) = 0 AND ts > '2018-12-31'",
    '5Y': " AND extract_dow(ts) = 1 AND extract_hour(ts) = 17 AND extract_min(ts) = 0 AND ts > '2014-12-31'",
  };
  // TODO - vulnerable to injection attack through term?
  const queryPrices = `SELECT price FROM prices WHERE stock_symbol=$1${priceQueryData[term]};`;
  queries.push(pool.query({
    text: queryPrices,
    values: [symbol],
    // rowMode: 'array',
  }));

  const queryTags = 'SELECT tag_name FROM tags t JOIN stock_tags s ON t.tag_id=s.tag_id WHERE stock_symbol=$1;';
  queries.push(pool.query({
    text: queryTags,
    values: [symbol],
  }));

  const queryStocks = 'SELECT stock_name,owners,analyst_hold FROM stocks WHERE stock_symbol=$1;';
  queries.push(pool.query({
    text: queryStocks,
    values: [symbol],
  }));

  const [priceHistoryRes, tagRes, stockRes] = await Promise.all(queries);
  // eslint-disable-next-line camelcase
  const { owners, analyst_hold, stock_name } = stockRes.rows[0];

  const stockHistory = {
    [`historicPrice${term}`]: priceHistoryRes.rows.map((row) => row.price),
    // [`historicPrice${term}`]: priceHistoryRes.rows[0],
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
  const pool = await db;
  const queries = [];

  for (let i = 0; i < prices.length; i += 1) {
    const query = ``

  }

  await Promise.all(queries);
  return queries.length;
};

module.exports = {
  getStockHistory,
  addStockHistory,
};
