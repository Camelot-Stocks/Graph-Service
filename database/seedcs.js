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

const copyCSVintoDB = async (filename, table, tableColsStr) => {
  const csvFile = path.resolve(__dirname, 'seedFiles', filename);
  const command = `COPY stock_history.${table} (${tableColsStr})
    FROM '${csvFile}' WITH DELIMITER=',' AND HEADER=FALSE`;

  fancy(`starting db insert for ${filename}`);
  return exec(`cqlsh -e "${command}"`).catch(fancy);
};

const seed = async () => {
  const client = new Client(clientOptions);

  await client.execute('TRUNCATE stock_history.stocks');
  await client.execute('TRUNCATE stock_history.stock_tags');
  await client.execute('TRUNCATE stock_history.prices');
  await client.execute('TRUNCATE stock_history.users');
  fancy('truncated existing table data');

  const stocksCount = 20;
  const stocksFilename = 'stocks.csv';
  const stockIds = await genCSV(stocksFilename, genStockRow, stocksCount);
  await copyCSVintoDB(stocksFilename, 'stocks', 'symbol,stock_name,analyst_hold,owners');

  await chainAsyncFuncCalls(async (filename, genBatch, batchCount, genBatchArgs) => {
    await genCSV(filename, genBatch, batchCount, genBatchArgs);

    return copyCSVintoDB(filename, 'prices', 'symbol,ts,price');
  }, stocksCount, (i) => (
    [`prices${i}.csv`, genPriceHistoryRows, 1, stockIds[i]]
  ), 10);

  await client.shutdown();
};

seed().catch(fancy);
