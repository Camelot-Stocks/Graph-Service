const { Client } = require('cassandra-driver');
const fancy = require('fancy-log');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { clientOptions } = require('./authcs');
const {
  chainAsyncFuncCalls,
  genCSV,
  genStockRow,
  genPriceHistoryRows,
} = require('./seeddatagen');


const seed = async () => {
  const client = new Client(clientOptions);

  await client.execute('TRUNCATE stock_history.stocks');
  await client.execute('TRUNCATE stock_history.stock_tags');
  await client.execute('TRUNCATE stock_history.prices');
  await client.execute('TRUNCATE stock_history.users');
  fancy('truncated existing table data');

  const stocksCount = 1;
  const stockIds = await genCSV('stocks.csv', genStockRow, stocksCount);

  await chainAsyncFuncCalls(async (filename, genBatch, batchCount, genBatchArgs) => {
    await genCSV(filename, genBatch, batchCount, genBatchArgs);

    const csvFile = path.resolve(__dirname, 'seedFiles', filename);
    const command = `COPY stock_history.prices (symbol,ts,price)
      FROM '${csvFile}' WITH DELIMITER=',' AND HEADER=FALSE`;

    fancy(`starting db insert for ${filename}`);
    return exec(`cqlsh -e "${command}"`).catch(fancy);
  }, stocksCount, (i) => (
    [`prices${i}.csv`, genPriceHistoryRows, 1, stockIds[i]]
  ));

  // for (let i = 0; i < stocksCount; i += 1) {
  //   const stockId = stockIds[i];
  //   // eslint-disable-next-line no-await-in-loop
  //   await genCSV(`prices${i}.csv`, genPriceHistoryRows, 1, stockId);
  // }

  await client.shutdown();
};

seed().catch(fancy);
