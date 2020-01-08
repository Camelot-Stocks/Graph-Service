/* eslint-disable no-await-in-loop */
const fancy = require('fancy-log');
const { db } = require('./index');
const { priceQueryData } = require('../server/controller');

const benchmarkDB = async (dbConn) => {
  const conn = await dbConn;
  fancy.info('tests starting...');

  const stocksquery = await conn.query('SELECT stock_symbol FROM stocks');
  const stocks = stocksquery.rows.map((row) => row.stock_symbol);

  const queriesData = [
    ['1D', priceQueryData['1D']],
    ['1W', priceQueryData['1W']],
    ['1M', priceQueryData['1M']],
    ['3M', priceQueryData['3M']],
    ['1Y', priceQueryData['1Y']],
    ['5Y', priceQueryData['5Y']],
  ];

  for (let i = 0; i < queriesData.length; i += 1) {
    const queryData = queriesData[i];
    const stock = stocks[Math.floor(Math.random() * 200)];

    try {
      const query = queryData[1].replace('$1', `'${stock}'`);
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
