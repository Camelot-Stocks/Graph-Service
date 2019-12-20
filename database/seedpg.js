/* eslint-disable no-console */
const { db, createDbTables, cleanDbTables } = require('./index');
const { genStock } = require('./seeddatagen');

const seedInc = 10000;

const seedStocks = (dbConn) => {
  let stocksTotal = 200;
  const inc = Math.min(seedInc, stocksTotal);

  // const prepQuery = `PREPARE seedStocks () AS
  //   INSERT INTO stocks (stock_name, symbol, analyst_hold) VALUES($1, $2, $3);`;
  const queries = [];

  while (stocksTotal > 0) {
    let query = '';
    for (let i = 0; i < inc; i += 1) {
      const [n, s, a] = genStock();
      query += `INSERT INTO stocks (stock_name, symbol, analyst_hold) VALUES ('${n}', '${s}', ${a});\n`;
    }

    queries.push(dbConn.query(query));
    stocksTotal -= inc;
    console.log(`${stocksTotal} stocks remaining`);
  }
  return Promise.all(queries);
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
