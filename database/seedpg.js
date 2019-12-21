/* eslint-disable no-console */
const fancy = require('fancy-log');
const faker = require('faker');
const { db, createDbTables, cleanDbTables } = require('./index');
const {
  genStocks, genTags, genUsers, genUserStocks, genPriceHistory,
} = require('./seeddatagen');

const stocksCount = 200;
let stocks;
let tagsIds;
let userIds;

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

const seedUsers = async (dbConn) => {
  const users = genUsers();

  let query = 'INSERT INTO users (firstname, lastname, balance) VALUES\n';
  for (let i = 0; i < users.length; i += 1) {
    const [f, l, b] = users[i];
    query += `('${f}', '${l}', '${b}'),\n`;
  }
  query = `${query.substring(0, query.length - 2)} RETURNING user_id;`;

  return dbConn.query(query);
};

const seedUserStocks = async (dbConn) => {
  const userStocks = genUserStocks(userIds, stocks);

  let query = 'INSERT INTO user_stocks (user_id, stock_symbol, quantity) VALUES\n';
  for (let i = 0; i < userStocks.length; i += 1) {
    const [u, s, q] = userStocks[i];
    query += `('${u}', '${s}', '${q}'),\n`;
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

        fancy(`initiated db prices insert for stock ${stockIdx + 1}/${stocksCount}`);
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

  const tagsRes = await seedTags(conn);
  tagsIds = tagsRes.rows.map((row) => row.tag_id);
  fancy('seeded tags table');

  await seedStockTags(conn);
  fancy('seeded stock_tags table');

  const usersRes = await seedUsers(conn);
  userIds = usersRes.rows.map((row) => row.user_id);
  fancy('seeded users table');

  await seedUserStocks(conn);
  fancy('seeded user_stocks table');

  fancy('seeding prices table...');
  await seedPrices(conn);
  fancy('seeded prices table');

  await conn.end();
};

seed(db).catch(console.log);
