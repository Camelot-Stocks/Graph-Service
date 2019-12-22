const { Client } = require('cassandra-driver');
const fancy = require('fancy-log');
const { clientOptions } = require('./authcs');
const {
  genCSV,
  genStockRow,
  genPriceHistoryRows,
} = require('./seeddatagen');


const seed = async () => {
  const client = new Client(clientOptions);

  const stocksCount = 20;
  const stockIds = await genCSV('stocks.csv', genStockRow, stocksCount);

  for (let i = 0; i < stocksCount; i += 1) {
    const stockId = stockIds[i];
    // eslint-disable-next-line no-await-in-loop
    await genCSV(`prices${i}.csv`, genPriceHistoryRows, 1, stockId);
  }

  await client.shutdown();
};

seed().catch(fancy);
