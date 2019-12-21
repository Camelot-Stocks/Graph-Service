const { Client } = require('cassandra-driver');
const fancy = require('fancy-log');
const { clientOptions } = require('./authcs');
const {
  genStocksCSV,
} = require('./seeddatagen');


const seed = async () => {
  const client = new Client(clientOptions);

  const stocksCount = 2000000;
  const [csvFile, symbols] = await genStocksCSV(stocksCount);

  debugger;

  await client.shutdown();
};

seed().catch(fancy);
