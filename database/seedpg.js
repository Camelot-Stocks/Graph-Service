/* eslint-disable no-console */
const faker = require('faker');
const { db, createDbTables, cleanDbTables } = require('./index');
const { genStocks, genPriceHistory } = require('./seeddatagen');

const seedInc = 10000;
const stocksCount = 200;
let stocks;

const seedStocks = (dbConn) => {
  stocks = genStocks(stocksCount);
  let query = '';
  for (let i = 0; i < stocksCount; i += 1) {
    const [s, n, a] = stocks[i];
    query += `INSERT INTO stocks (stock_symbol, stock_name, analyst_hold) VALUES ('${s}', '${n}', ${a});\n`;
  }

  return dbConn.query(query);
};

const seedPrices = (dbConn) => {
  const queries = [];
  stocks.forEach((stock, idx) => {
    const s = stock[0];

    const startPrice = faker.random.number({ min: 1, max: 1000, precision: 0.01 });
    const trend = faker.random.number({ min: -1, max: 1, precision: 0.01 });
    const priceCount = 5 * 8760 * 12;
    const prices = genPriceHistory(startPrice, trend, priceCount);

    let query = '';
    prices.forEach((price) => {
      const [ts, p] = price;
      query += `INSERT INTO prices (stock_symbol, ts, price) VALUES ('${s}', '${ts}', ${p});\n`;
    });

    queries.push(dbConn.query(query));
    console.log(`sent db insert for stock ${idx}`);
  });
  return Promise.all(queries);
};

const seed = async (dbConn) => {
  const conn = await dbConn;

  await createDbTables(conn);
  console.log('db tables created if not existing');

  await cleanDbTables(conn);
  console.log('db tables cleaned');

  await seedStocks(conn);
  console.log('seeded stocks table');

  await seedPrices(conn);
  console.log('seeded prices table');

  await conn.end();
};

seed(db).catch(console.log);
