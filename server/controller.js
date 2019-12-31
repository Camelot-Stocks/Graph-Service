const { db } = require('../database/index.js');


const getStockHistory = async (symbol, term) => {
  // TODO - can these three combined queries be moved to a pg function for one server query?
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
  const queryPrices = `SELECT price FROM prices WHERE stock_symbol='${symbol}'${priceQueryData[term]};`;
  queries.push(pool.query(queryPrices));

  const queryTags = `SELECT tag_name FROM tags t JOIN stock_tags s ON t.tag_id=s.tag_id WHERE stock_symbol='${symbol}';`;
  queries.push(pool.query(queryTags));

  const queryStocks = `SELECT stock_name,owners,analyst_hold FROM stocks WHERE stock_symbol='${symbol}';`;
  queries.push(pool.query(queryStocks));

  const [priceHistoryRes, tagRes, stockRes] = await Promise.all(queries);
  // eslint-disable-next-line camelcase
  const { owners, analyst_hold, stock_name } = stockRes.rows[0];

  const stockHistory = {
    [`historicPrice${term}`]: priceHistoryRes.rows.map((row) => row.price),
    tags: tagRes.rows.map((row) => row.tag_name),
    symbol,
    owners,
    analystHold: analyst_hold,
    name: stock_name,
  };

  return stockHistory;
};

module.exports = {
  getStockHistory,
};
