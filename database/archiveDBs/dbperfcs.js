/* eslint-disable no-await-in-loop */
const { Client } = require('cassandra-driver');
const fancy = require('fancy-log');
const { clientOptions } = require('./authcs');


const benchmarkDB = async () => {
  const conn = new Client(clientOptions);
  const testres = await conn.execute('SELECT symbol FROM stocks');
  const stocks = testres.rows.map((row) => row.symbol);
  fancy.info('tests starting...');

  const queriesData = [
    ['1D', " AND ts > '2019-12-29'"],
    ['1W', " AND ts > '2019-12-23' AND filter10min = true"],
    ['1M', " AND ts > '2019-11-30' AND filter1hr = true"],
    ['3M', " AND ts > '2019-09-30' AND filter1hr = true"],
    ['1Y', " AND ts > '2018-12-31' AND filter1day = true"],
    ['5Y', " AND ts > '2014-12-31' AND filter7day = true"],
  ];

  for (let i = 0; i < queriesData.length; i += 1) {
    const queryData = queriesData[i];
    const stock = stocks[Math.floor(Math.random() * 200)];

    try {
      const query = `SELECT ts,price FROM prices WHERE symbol='${stock}'${queryData[1]};`;
      let start = process.hrtime();
      const res = await conn.execute(query);
      const end = process.hrtime(start);
      fancy.info(`${queryData[0]} query time first exec: ${end[1] / 1000000}ms`, `${res.rowLength} rows returned`);

      let sum = 0;
      const runs = 3;
      for (let j = 0; j < runs; j += 1) {
        start = process.hrtime();
        await conn.execute(query);
        sum += process.hrtime(start)[1];
      }
      fancy.info(`${queryData[0]} query time next ${runs} avg: ${((sum / runs) / 1000000).toFixed(6)}ms`);
    } catch (error) {
      fancy.error(error);
    }
  }


  fancy.info('...tests complete');
  await conn.shutdown();
};

benchmarkDB().catch(fancy);
