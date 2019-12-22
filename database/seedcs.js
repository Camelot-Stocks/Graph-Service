const { Client } = require('cassandra-driver');
const fancy = require('fancy-log');
const { clientOptions } = require('./authcs');
const {
  genStockRow,
  genCSV,
  // genStocksCSV,
} = require('./seeddatagen');


const seed = async () => {
  const client = new Client(clientOptions);

  const stocksCount = 2000000;
  // eslint-disable-next-line no-unused-vars
  // const [csvFile, symbols] = await genStocksCSV(stocksCount);
  await genCSV('stocks.csv', genStockRow, stocksCount);

  await client.shutdown();
};

seed().catch(fancy);
