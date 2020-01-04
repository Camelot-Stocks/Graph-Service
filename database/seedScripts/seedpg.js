/* eslint-disable no-console */
const fancy = require('fancy-log');
// const faker = require('faker');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const { db, createDbTables, cleanDbTables } = require('../index');
const authec2 = require('../authec2');
const {
  chainAsyncFuncCalls,
  genCSV,
  deleteCSV,
  genStockRow,
  genTags,
  genTagRows,
  genStockTagRows,
  genUserRows,
  genUserStocksRows,
} = require('./seeddatagen');
const genPriceHistoryRowsAsync = require('../seedScripts/genPriceHistoryRowsAsync');


const copyCSVintoDB = async (hostAuth, filename, table, tableColsStr, delimiter = ',') => {
  const csvFile = path.resolve(__dirname, '..', 'seedFiles', filename);
  const command = `\\copy ${table} (${tableColsStr}) FROM '${csvFile}'
     WITH DELIMITER '${delimiter}'`;

  const {
    host, database, user,
  } = hostAuth;
  fancy(`starting db write for ${filename}`);
  return exec(`psql -h ${host} -d ${database} -U ${user} -c "${command}"`).catch(fancy);
};

const seed = async (dbConn, dbHost) => {
  const conn = await dbConn;

  await createDbTables(conn);
  fancy('db tables created if not existing');

  await cleanDbTables(conn);
  fancy('db tables cleaned');

  const stocksCount = 200;
  const stocksFilename = 'stocks.csv';
  await genCSV(stocksFilename, genStockRow, stocksCount);
  await copyCSVintoDB(dbHost, stocksFilename, 'stocks', 'stock_symbol,stock_name,owners,analyst_hold');
  fancy('seeded stocks table');
  const stocksRes = await conn.query('SELECT stock_symbol FROM stocks;');
  const stockSymbols = stocksRes.rows.map((row) => row.stock_symbol);
  // const stocksCount = stockSymbols.length;

  const tags = genTags();
  const tagsFilename = 'tags.csv';
  await genCSV(tagsFilename, genTagRows, 1, [tags]);
  await copyCSVintoDB(dbHost, tagsFilename, 'tags', 'tag_name');
  fancy('seeded tags table');

  const tagsRes = await conn.query('SELECT tag_id FROM tags;');
  const tagsIds = tagsRes.rows.map((row) => row.tag_id);
  const stockTagsFilename = 'stock_tags.csv';
  await genCSV(stockTagsFilename, genStockTagRows, 1, [tagsIds, stockSymbols]);
  await copyCSVintoDB(dbHost, stockTagsFilename, 'stock_tags', 'tag_id,stock_symbol');
  fancy('seeded stock_tags table');

  const usersFilename = 'users.csv';
  await genCSV(usersFilename, genUserRows, 1);
  await copyCSVintoDB(dbHost, usersFilename, 'users', 'firstname,lastname,balance', '|');
  fancy('seeded users table');

  const usersRes = await conn.query('SELECT user_id FROM users;');
  const userIds = usersRes.rows.map((row) => row.user_id);
  const userStocksFilename = 'user_stocks.csv';
  await genCSV(userStocksFilename, genUserStocksRows, 1, [userIds, stockSymbols]);
  await copyCSVintoDB(dbHost, userStocksFilename, 'user_stocks', 'user_id,stock_symbol,quantity');
  fancy('seeded user_stocks table');

  const fileCount = 5;
  await chainAsyncFuncCalls(deleteCSV, fileCount, (unused, fileNum) => (
    [`prices${fileNum}.csv`]), fileCount);
  await chainAsyncFuncCalls(genCSV, stocksCount, (i, fileNum, chainI) => (
    [`prices${fileNum}.csv`, genPriceHistoryRowsAsync, 1, [stockSymbols[i]], true, chainI]
  ), fileCount);
  fancy('seeding prices table...');
  await chainAsyncFuncCalls(copyCSVintoDB, fileCount, (i) => (
    [dbHost, `prices${i}.csv`, 'prices', 'stock_symbol,ts,price']
  ), 1);
  fancy('seeded prices table');

  // update db with schemaAdd.sql

  await conn.end();
};

seed(db, authec2.production).catch(console.log);
