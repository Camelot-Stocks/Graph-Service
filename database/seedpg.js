/* eslint-disable no-console */
const fancy = require('fancy-log');
const faker = require('faker');
const { db, createDbTables, cleanDbTables } = require('./index');
const { genStocks, genTags, genPriceHistory } = require('./seeddatagen');

const stocksCount = 2;
let stocks;
let tagsIds;

const seedStocks = (dbConn) => {
  stocks = genStocks(stocksCount);
  let query = '';
  for (let i = 0; i < stocksCount; i += 1) {
    const [s, n, a] = stocks[i];
    query += `INSERT INTO stocks (stock_symbol, stock_name, analyst_hold) VALUES ('${s}', '${n}', ${a});\n`;
  }

  return dbConn.query(query);
};

const seedTags = async (dbConn) => {
  const tags = genTags();

  let query = 'INSERT INTO tags (tag_name) VALUES\n';
  for (let i = 0; i < tags.length; i += 1) {
    const tag = tags[i];
    query += `('${tag}'),\n`;
  }
  query = `${query.substring(0, query.length - 2)} RETURNING tag_id;`;

  return dbConn.query(query);
};

const seedStockTags = async (dbConn) => {
  const stockTagsCount = 500;
  let query = 'INSERT INTO stock_tags (tag_id, stock_symbol) VALUES\n';
  for (let i = 0; i < stockTagsCount; i += 1) {
    const tagId = tagsIds[faker.random.number(tagsIds.length - 1)];
    const stockSymbol = stocks[faker.random.number(stocks.length - 1)][0];
    query += `('${tagId}', '${stockSymbol}'),\n`;
  }
  query = `${query.substring(0, query.length - 2)};`;

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

        const prices = genPriceHistory();

        let query = 'INSERT INTO prices (stock_symbol, ts, price) VALUES\n';
        for (let j = 0; j < prices.length; j += 1) {
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

  const res = await seedTags(conn);
  tagsIds = res.rows.map((row) => row.tag_id);
  fancy('seeded tags table');

  await seedStockTags(conn);
  fancy('seeded stock_tags table');

  await seedPrices(conn);
  fancy('seeded prices table');

  await conn.end();
};

seed(db).catch(console.log);
