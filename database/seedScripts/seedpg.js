/* eslint-disable no-console */
const fancy = require('fancy-log');
// const faker = require('faker');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const { db, createDbTables, cleanDbTables } = require('../index');
const authec2 = require('../authec2');
const {
  // genStocks, genUsers, genUserStocks, genPriceHistory,
  chainAsyncFuncCalls,
  genCSV,
  deleteCSV,
  genStockRow,
  genTags,
  genTagRows,
  genStockTagRows,
  genUserRows,
  genUserStocksRows,
} = require('./seeddatagen');
const genPriceHistoryRowsAsync = require('../seedScripts/genPriceHistoryRowsAsync');


// const stocksCount = 200;
// let stocks;
// let tagsIds;
// let userIds;

// const seedStocks = (dbConn) => {
//   stocks = genStocks(stocksCount);
//   let query = '';
//   for (let i = 0; i < stocksCount; i += 1) {
//     const [s, n, o, a] = stocks[i];
//     query += `INSERT INTO stocks (stock_symbol, stock_name, owners, analyst_hold) VALUES ('${s}', '${n}', ${o}, ${a});\n`;
//   }

//   return dbConn.query(query);
// };

// const seedTags = async (dbConn) => {
//   const tags = genTags();

//   let query = 'INSERT INTO tags (tag_name) VALUES\n';
//   for (let i = 0; i < tags.length; i += 1) {
//     const tag = tags[i];
//     query += `('${tag}'),\n`;
//   }
//   query = `${query.substring(0, query.length - 2)} RETURNING tag_id;`;

//   return dbConn.query(query);
// };

// const seedStockTags = async (dbConn) => {
//   const stockTagsCount = 500;
//   let query = 'INSERT INTO stock_tags (tag_id, stock_symbol) VALUES\n';
//   for (let i = 0; i < stockTagsCount; i += 1) {
//     const tagId = tagsIds[faker.random.number(tagsIds.length - 1)];
//     const stockSymbol = stocks[faker.random.number(stocks.length - 1)][0];
//     query += `('${tagId}', '${stockSymbol}'),\n`;
//   }
//   query = `${query.substring(0, query.length - 2)};`;

//   return dbConn.query(query);
// };

// const seedUsers = async (dbConn) => {
//   const users = genUsers();

//   let query = 'INSERT INTO users (firstname, lastname, balance) VALUES\n';
//   for (let i = 0; i < users.length; i += 1) {
//     const [f, l, b] = users[i];
//     query += `('${f}', '${l}', '${b}'),\n`;
//   }
//   query = `${query.substring(0, query.length - 2)} RETURNING user_id;`;

//   return dbConn.query(query);
// };

// const seedUserStocks = async (dbConn) => {
//   const userStocks = genUserStocks(userIds, stocks);

//   let query = 'INSERT INTO user_stocks (user_id, stock_symbol, quantity) VALUES\n';
//   for (let i = 0; i < userStocks.length; i += 1) {
//     const [u, s, q] = userStocks[i];
//     query += `('${u}', '${s}', '${q}'),\n`;
//   }
//   query = `${query.substring(0, query.length - 2)};`;

//   return dbConn.query(query);
// };

// const seedPrices = async (dbConn) => {
//   const queryChains = [];
//   const chainCount = 1;
//   const chainLinkCount = Math.ceil(stocksCount / chainCount);
//   const chainLinks = [];
//   for (let i = 0; i < chainLinkCount; i += 1) {
//     chainLinks.push(i);
//   }

//   const queryChain = (concurrentIdx, iters) => (
//     iters.reduce((chain, chainIter) => (
//       chain.then(() => {
//         const stockIdx = chainIter + chainLinkCount * concurrentIdx;
//         if (stockIdx >= stocksCount) {
//           return Promise.resolve();
//         }
//         const stock = stocks[stockIdx];
//         const s = stock[0];

//         const prices = genPriceHistory();

//         let query = 'INSERT INTO prices (stock_symbol, ts, price) VALUES\n';
//         for (let j = 0; j < prices.length; j += 1) {
//           const price = prices[j];
//           const [ts, p] = price;
//           query += `('${s}', '${ts}', ${p}),\n`;
//         }
//         query = `${query.substring(0, query.length - 2)};`;

//         fancy(`initiated db prices insert for stock ${stockIdx + 1}/${stocksCount}`);
//         return dbConn.query(query);
//       })
//     ), Promise.resolve())
//   );

//   for (let i = 0; i < chainCount; i += 1) {
//     queryChains.push(queryChain(i, chainLinks));
//   }

//   return Promise.all(queryChains);
// };

const copyCSVintoDB = async (hostAuth, filename, table, tableColsStr, delimiter = ',') => {
  const csvFile = path.resolve(__dirname, '..', 'seedFiles', filename);
  const command = `\\copy ${table} (${tableColsStr}) FROM '${csvFile}'
     WITH DELIMITER '${delimiter}'`;

  const {
    host, database, user, password,
  } = hostAuth;
  fancy(`starting db write for ${filename}`);
  return exec(`psql -h ${host} -d ${database} -U ${user} -c "${command}"`).catch(fancy);
};

const seed = async (dbConn, dbHost) => {
  const conn = await dbConn;

  // await createDbTables(conn);
  // fancy('db tables created if not existing');

  // await cleanDbTables(conn);
  // fancy('db tables cleaned');

  // const stocksCount = 200;
  // const stocksFilename = 'stocks.csv';
  // const stockSymbols = await genCSV(stocksFilename, genStockRow, stocksCount);
  // await copyCSVintoDB(dbHost, stocksFilename, 'stocks', 'stock_symbol,stock_name,owners,analyst_hold');
  // fancy('seeded stocks table');

  // const tags = genTags();
  // const tagsFilename = 'tags.csv';
  // await genCSV(tagsFilename, genTagRows, 1, [tags]);
  // await copyCSVintoDB(dbHost, tagsFilename, 'tags', 'tag_name');
  // fancy('seeded tags table');

  // const tagsRes = await conn.query('SELECT tag_id FROM tags;');
  // const tagsIds = tagsRes.rows.map((row) => row.tag_id);
  // const stockTagsFilename = 'stock_tags.csv';
  // await genCSV(stockTagsFilename, genStockTagRows, 1, [tagsIds, stockSymbols]);
  // await copyCSVintoDB(dbHost, stockTagsFilename, 'stock_tags', 'tag_id,stock_symbol');
  // fancy('seeded stock_tags table');

  // const usersFilename = 'users.csv';
  // await genCSV(usersFilename, genUserRows, 1);
  // await copyCSVintoDB(dbHost, usersFilename, 'users', 'firstname,lastname,balance', '|');
  // fancy('seeded users table');

  // const usersRes = await conn.query('SELECT user_id FROM users;');
  // const userIds = usersRes.rows.map((row) => row.user_id);
  // const userStocksFilename = 'user_stocks.csv';
  // await genCSV(userStocksFilename, genUserStocksRows, 1, [userIds, stockSymbols]);
  // await copyCSVintoDB(dbHost, userStocksFilename, 'user_stocks', 'user_id,stock_symbol,quantity');
  // fancy('seeded user_stocks table');

  const stocksRes = await conn.query('SELECT stock_symbol FROM stocks;');
  const stockSymbols = stocksRes.rows.map((row) => row.stock_symbol);
  const stocksCount = stockSymbols.length;
  const chainCount = 5;
  await chainAsyncFuncCalls(deleteCSV, chainCount, (unused, fileNum) => (
    [`prices${fileNum}.csv`]), chainCount);
  await chainAsyncFuncCalls(genCSV, stocksCount, (i, fileNum, chainI) => (
    [`prices${fileNum}.csv`, genPriceHistoryRowsAsync, 1, [stockSymbols[i]], true, chainI]
  ), chainCount);
  // fancy('seeding prices table...');
  // await chainAsyncFuncCalls(copyCSVintoDB, stocksCount, (i) => (
  //   [`prices${i}.csv`, 'prices', 'stock_symbol,ts,price']
  // ), 1);
  // fancy('seeded prices table');

  // update db with schemaAdd.sql

  await conn.end();
};

seed(db, authec2.production).catch(console.log);
