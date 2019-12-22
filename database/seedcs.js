const { Client } = require('cassandra-driver');
const fancy = require('fancy-log');
const { clientOptions } = require('./authcs');
const {
  chainAsyncFuncCalls,
  genCSV,
  genStockRow,
  genPriceHistoryRows,
} = require('./seeddatagen');


const seed = async () => {
  const client = new Client(clientOptions);

  const stocksCount = 10;
  const stockIds = await genCSV('stocks.csv', genStockRow, stocksCount);

  chainAsyncFuncCalls(genCSV, stocksCount, (i) => (
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
