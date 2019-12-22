const { Client } = require('cassandra-driver');
const fancy = require('fancy-log');
const path = require('path');
const { clientOptions } = require('./authcs');
const {
  chainAsyncFuncCalls,
  genCSV,
  genStockRow,
  genPriceHistoryRows,
} = require('./seeddatagen');


const seed = async () => {
  const client = new Client(clientOptions);

  const stocksCount = 2;
  const stockIds = await genCSV('stocks.csv', genStockRow, stocksCount);

  await chainAsyncFuncCalls(async (filename, genBatch, batchCount, genBatchArgs) => {
    await genCSV(filename, genBatch, batchCount, genBatchArgs);

    const csvFile = path.resolve(__dirname, 'seedFiles', filename);
    const query = `COPY stock_history.prices (symbol,ts,price)
      FROM ${csvFile} WITH DELIMITER=',' AND HEADER=FALSE`;

    fancy(`starting db insert for ${filename}`);
    await client.execute(query).catch(fancy);
    fancy(`finished db insert for ${filename}`);
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
