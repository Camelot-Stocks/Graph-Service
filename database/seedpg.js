/* eslint-disable no-console */
const fancy = require('fancy-log');
const { db, createDbTables, cleanDbTables } = require('./index');
const { genStocks, genPriceHistory } = require('./seeddatagen');

const stocksCount = 20;
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

const seedPrices = async (dbConn) => {
  const queryChains = [];
  const chainCount = 5;
  const chainLinkCount = Math.ceil(stocksCount / chainCount);
  const chainLinks = [];
  for (let i = 0; i < chainLinkCount; i += 1) {
    chainLinks.push(i);
  }

  const queryChain = (concurrentIdx, iters) => (
    iters.reduce((chain, chainIter) => (
      chain.then(() => {
        const stockIdx = chainIter + chainLinkCount * concurrentIdx;
        if (stockIdx >= stocksCount) {
          return Promise.resolve();
        }
        const stock = stocks[stockIdx];
        const s = stock[0];

        const priceCount = 5 * 8760 * 12;
        const prices = genPriceHistory(priceCount);

        let query = 'INSERT INTO prices (stock_symbol, ts, price) VALUES\n';
        for (let j = 0; j < priceCount; j += 1) {
          const price = prices[j];
          const [ts, p] = price;
          query += `('${s}', '${ts}', ${p}),\n`;
        }
        query = `${query.substring(0, query.length - 2)};`;

        fancy(`initiated db insert for stock ${stockIdx + 1}/${stocksCount} prices`);
        return dbConn.query(query);
      })
    ), Promise.resolve())
  );

  for (let i = 0; i < chainCount; i += 1) {
    queryChains.push(queryChain(i, chainLinks));
  }

  return Promise.all(queryChains);
};

const seed = async (dbConn) => {
  const conn = await dbConn;

  await createDbTables(conn);
  fancy('db tables created if not existing');

  await cleanDbTables(conn);
  fancy('db tables cleaned');

  await seedStocks(conn);
  fancy('seeded stocks table');

  await seedPrices(conn);
  fancy('seeded prices table');

  await conn.end();
};

seed(db).catch(console.log);
