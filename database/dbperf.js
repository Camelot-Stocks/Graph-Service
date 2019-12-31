/* eslint-disable no-await-in-loop */
const fancy = require('fancy-log');
const { db } = require('./index');

const benchmarkDB = async (dbConn) => {
  const conn = await dbConn;
  fancy.info('tests starting...');

  const stocksquery = await conn.query('SELECT stock_symbol FROM stocks');
  const stocks = stocksquery.rows.map((row) => row.stock_symbol);

  const queriesData = [
    ['1D', " AND ts > '2019-12-30'"],
    ['1W', " AND ts > '2019-12-24' AND extract_min(ts) IN (0, 10, 20, 30, 40, 50)"],
    ['1M', " AND ts > '2019-11-30' AND extract_min(ts) = 0"],
    ['3M', " AND ts > '2019-09-30' AND extract_min(ts) = 0"],
    ['1Y', " AND extract_hour(ts) = 17 AND extract_min(ts) = 0 AND ts > '2018-12-31'"],
    ['5Y', " AND extract_dow(ts) = 1 AND extract_hour(ts) = 17 AND extract_min(ts) = 0 AND ts > '2014-12-31'"],
  ];

  for (let i = 0; i < queriesData.length; i += 1) {
    const queryData = queriesData[i];
    const stock = stocks[Math.floor(Math.random() * 200)];

    try {
      const query = `SELECT price FROM prices WHERE stock_symbol='${stock}'${queryData[1]};`;
      let start = process.hrtime();
      const res = await conn.query(query);
      const end = process.hrtime(start);
      fancy.info(`${queryData[0]} query time first exec: ${end[1] / 1000000}ms`, `${res.rows.length} rows returned`);

      let sum = 0;
      const runs = 3;
      for (let j = 0; j < runs; j += 1) {
        start = process.hrtime();
        await conn.query(query);
        sum += process.hrtime(start)[1];
      }
      fancy.info(`${queryData[0]} query time next ${runs} avg: ${((sum / runs) / 1000000).toFixed(6)}ms`);
    } catch (error) {
      fancy.error(error);
    }
  }


  fancy.info('...tests complete');
  conn.end();
};

benchmarkDB(db).catch(fancy);
