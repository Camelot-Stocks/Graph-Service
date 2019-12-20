/* eslint-disable no-console */
const { db, createDbTables, cleanDbTables } = require('./index');
const { genStocks, genPriceHistory } = require('./seeddatagen');

const seedInc = 10000;
const stocksCount = 200;
let stocks;

const seedStocks = (dbConn) => {
  stocks = genStocks(stocksCount);
  let query = '';
  for (let i = 0; i < stocksCount; i += 1) {
    const [n, s, a] = stocks[i];
    query += `INSERT INTO stocks (stock_symbol, stock_name, analyst_hold) VALUES ('${s}', '${n}', ${a});\n`;
  }

  return dbConn.query(query);
};

// const seedPrices = (dbConn) => {
//   const queries = [];
//   stocks.forEach((stock) => {
//     const prices = genPriceHistory();

//     let query = '';
//     prices.forEach((price) => {

//       query += `INSERT INTO prices (stock_id, ts, price) VALUES ('${id}', '${ts}', ${p});\n`;
//     });

//     dbConn.query(query);
//   });
//   return Promise.all(queries);
// };

const seed = async (dbConn) => {
  const conn = await dbConn;

  await createDbTables(conn);
  console.log('db tables created if not existing');

  await cleanDbTables(conn);
  console.log('db tables cleaned');

  await seedStocks(conn);
  console.log('seeded stocks table');

  // await seedPrices(conn);
  // console.log('seeded prices table');

  await conn.end();
};

seed(db).catch(console.log);
