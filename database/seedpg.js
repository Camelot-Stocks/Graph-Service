/* eslint-disable no-console */
const { db, createDbTables, cleanDbTables } = require('./index');
const { genStocks } = require('./seeddatagen');

const seedInc = 10000;
const stocksCount = 200;
let stocks;

const seedStocks = (dbConn) => {
  // const prepQuery = `PREPARE seedStocks () AS
  //   INSERT INTO stocks (stock_name, symbol, analyst_hold) VALUES($1, $2, $3);`;

  // const queries = [];

  // const inc = Math.min(seedInc, stocksCount);
  // while (stocksCount > 0) {
  //   let query = '';
  //   for (let i = 0; i < inc; i += 1) {
  //     query += `INSERT INTO stocks (stock_name, symbol, analyst_hold) VALUES ('${n}', '${s}', ${a});\n`;
  //   }

  //   queries.push(dbConn.query(query));
  //   stocksCount -= inc;
  //   console.log(`${stocksCount} stocks remaining`);
  // }
  stocks = genStocks(stocksCount);
  let query = '';
  for (let i = 0; i < stocksCount; i += 1) {
    const [n, s, a] = stocks[i];
    query += `INSERT INTO stocks (stock_name, symbol, analyst_hold) VALUES ('${n}', '${s}', ${a});\n`;
  }

  return dbConn.query(query);
};

const seed = async (dbConn) => {
  const conn = await dbConn;

  await createDbTables(conn);
  console.log('db tables created');

  await cleanDbTables(conn);
  console.log('db tables cleaned');

  await seedStocks(conn);
  console.log('seeded stocks table');

  await conn.end();
};

seed(db).catch(console.log);
