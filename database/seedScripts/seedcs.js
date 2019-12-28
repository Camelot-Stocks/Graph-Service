const { Client } = require('cassandra-driver');
const fancy = require('fancy-log');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { clientOptions } = require('../authcs');
const {
  chainAsyncFuncCalls,
  genCSV,
  genStockRow,
  genTags,
  genStockTagRows,
  genUserRows,
} = require('./seeddatagen');
const genPriceHistoryRowsAsync = require('./genPriceHistoryRowsAsync');

const copyCSVintoDB = async (filename, table, tableColsStr, delimiter = ',') => {
  const csvFile = path.resolve(__dirname, '..', 'seedFiles', filename);
  const command = `COPY stock_history.${table} (${tableColsStr})
    FROM '${csvFile}' WITH DELIMITER='${delimiter}' AND HEADER=FALSE`;

  fancy(`starting db write for ${filename}`);
  return exec(`cqlsh -e "${command}"`).catch(fancy);
};

const seed = async () => {
  const client = new Client(clientOptions);

  await client.execute('TRUNCATE stock_history.stocks');
  await client.execute('TRUNCATE stock_history.stock_tags');
  await client.execute('TRUNCATE stock_history.prices');
  await client.execute('TRUNCATE stock_history.users');
  fancy('truncated existing table data');


  const stocksCount = 1;
  const stocksFilename = 'stocks.csv';
  const stockSymbols = await genCSV(stocksFilename, genStockRow, stocksCount);
  await copyCSVintoDB(stocksFilename, 'stocks', 'symbol,stock_name,analyst_hold,owners');
  fancy('stocks table seeded');


  const tags = genTags();
  const stockTagsFilename = 'stock_tags.csv';
  await genCSV(stockTagsFilename, genStockTagRows, 1, [stockSymbols, tags]);
  await copyCSVintoDB(stockTagsFilename, 'stock_tags', 'symbol,tag');
  fancy('stock_tags table seeded');


  const usersFilename = 'users.csv';
  await genCSV(usersFilename, genUserRows, 1, [stockSymbols]);
  await copyCSVintoDB(usersFilename, 'users', 'user_id,firstname,lastname,balance,stocks', '|');
  fancy('users table seeded');


  await chainAsyncFuncCalls(async (filename, genBatch, batchCount, genBatchArgs) => {
    await genCSV(filename, genBatch, batchCount, genBatchArgs);

    return copyCSVintoDB(filename, 'prices', 'symbol,ts,price,filter10min,filter1hr,filter1day,filter7day');
  }, stocksCount, (i) => (
    [`prices${i}.csv`, genPriceHistoryRowsAsync, 1, [stockSymbols[i]]]
  ), 5);
  fancy('prices table seeded');


  await client.shutdown();
};

seed().catch(fancy);
