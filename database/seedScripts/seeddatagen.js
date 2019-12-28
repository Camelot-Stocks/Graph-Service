const faker = require('faker');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const fancy = require('fancy-log');
const uuid = require('cassandra-driver').types.Uuid;

const genCSV = async (filename, genData, batchCount, genDataArgs = []) => {
  const csvFile = path.resolve(__dirname, '..', 'seedFiles', filename);
  const encoding = 'utf-8';
  const writer = fs.createWriteStream(csvFile);

  const write = async (batchCountTotal, batchCountLeft, cb, batchIds = []) => {
    let canWrite = true;
    let i = batchCountLeft;
    fancy(`1/${batchCountTotal} batch data gen and write started for ${filename}`);

    do {
      i -= 1;
      // eslint-disable-next-line no-await-in-loop
      const dataPair = await genData(...genDataArgs);
      batchIds.push(dataPair[0]);
      const writeStr = dataPair[1];

      if (i === 0) {
        writer.write(writeStr, encoding, () => {
          fancy(`${batchCountTotal}/${batchCountTotal} batch data gen and write finished for ${filename}`);
          cb(batchIds);
        });
      } else {
        canWrite = writer.write(writeStr, encoding);
      }
    } while (i > 0 && canWrite);

    if (i > 0) {
      writer.once('drain', () => write(batchCountTotal, i, cb, batchIds));
    }
  };

  return new Promise((resolve) => write(batchCount, batchCount, resolve));
};

const chainAsyncFuncCalls = (asyncFunc, totalLinkCount, callsArgGenerator, chainCount = 5) => {
  const chains = [];
  const chainLinkCount = Math.ceil(totalLinkCount / chainCount);
  const chainLinksIdxs = [];
  for (let i = 0; i < chainLinkCount; i += 1) {
    chainLinksIdxs.push(i);
  }

  const chain = (chainId, cLIs) => (
    cLIs.reduce((chainLink, cLI) => (
      chainLink.then(() => {
        const linkIdx = cLI + chainLinkCount * chainId;

        return linkIdx >= totalLinkCount
          ? Promise.resolve()
          : asyncFunc(...callsArgGenerator(linkIdx));
      })
    ), Promise.resolve())
  );

  for (let chainId = 0; chainId < chainCount; chainId += 1) {
    chains.push(chain(chainId, chainLinksIdxs));
  }

  return Promise.all(chains);
};

const genStockRow = () => {
  const symbol = faker.random.alphaNumeric(5).toUpperCase();
  const name = faker.company.companyName().replace(/'|,/g, '');
  const analystHold = faker.random.number({ min: 0, max: 100, precision: 1 });
  const owners = faker.random.number(20000);
  return [symbol, `${symbol},${name},${analystHold},${owners}\n`];
};

const genPriceHistoryRows = (symbol) => {
  let price = faker.random.number({ min: 1, max: 1000, precision: 0.01 });
  let trend = faker.random.number({ min: -1, max: 1, precision: 0.01 });
  const time = moment('2015-01-01 00:00:00-05');

  const priceCount = 5 * 8760 * 12;
  let rowsStr = '';
  for (let i = 0; i < priceCount; i += 1) {
    // const ts = time.format('YYYY-MM-DD HH:mm:ssZZ').substring(0, 22);
    const ts = time.format('YYYY-MM-DD HH:mm:ssZZ');
    price = Math.max(Math.round(100 * (price + trend
      * faker.random.number({ min: 0, max: 1, precision: 0.01 }))) / 100, 0.05);
    const minute = time.minute();
    const filter10min = minute % 10 === 0;
    const filter1hr = minute === 0;
    const filter1day = filter1hr && time.hour() === 17;
    const filter7day = filter1day && time.day() === 1;
    rowsStr += `${symbol},${ts},${price},${filter10min},${filter1hr},${filter1day},${filter7day}\n`;

    time.add(5, 'minutes');
    if (faker.random.number(100) > 97) {
      trend = faker.random.number({ min: -1, max: 1, precision: 0.01 });
    }
  }
  return [null, rowsStr];
};

const genStockTagRows = (symbols, tags) => {
  const stockTagsCount = symbols.length * 3;
  let rowsStr = '';
  for (let i = 0; i < stockTagsCount; i += 1) {
    const tag = tags[faker.random.number(tags.length - 1)];
    const symbol = symbols[faker.random.number(symbols.length - 1)];
    rowsStr += `'${symbol}','${tag}'\n`;
  }

  return [null, rowsStr];
};

const genUserRows = (symbols) => {
  const userCount = 100000;
  let rowsStr = '';
  for (let i = 0; i < userCount; i += 1) {
    const userId = uuid.random();
    const firstname = faker.name.firstName().replace('\'', '');
    const lastname = faker.name.lastName().replace('\'', '');
    const balance = faker.random.number({ min: 0, max: 5000000, precision: 0.01 });
    const stocksCount = faker.random.number(6);
    const stocks = {};
    for (let j = 0; j < stocksCount; j += 1) {
      const stock = symbols[faker.random.number(symbols.length - 1)];
      stocks[stock] = faker.random.number(1000);
    }
    const stocksStr = JSON.stringify(stocks).replace(/"/g, '\'');
    rowsStr += `${userId}|'${firstname}'|'${lastname}'|${balance}|${stocksStr}\n`;
  }
  return [null, rowsStr];
};

const genStocks = (qty) => {
  const stocks = [];
  for (let i = 0; i < qty; i += 1) {
    const symbol = faker.random.alphaNumeric(5).toUpperCase();
    const name = faker.company.companyName().replace('\'', '');
    const owners = faker.random.number(20000);
    const analystHold = faker.random.number({ min: 0, max: 100, precision: 1 });
    stocks.push([symbol, name, owners, analystHold]);
  }
  return stocks;
};

const genTags = () => {
  const tagCount = 20;
  const tags = new Set();

  while (tags.size < tagCount) {
    tags.add(faker.commerce.department());
  }

  tags.add('Top 100');
  tags.add('So Hot Right Now');

  return [...tags];
};

const genUsers = () => {
  const userCount = 100000;
  const users = [];
  for (let i = 0; i < userCount; i += 1) {
    const firstname = faker.name.firstName().replace('\'', '');
    const lastname = faker.name.lastName().replace('\'', '');
    const balance = faker.random.number({ min: 0, max: 5000000, precision: 0.01 });
    users.push([firstname, lastname, balance]);
  }
  return users;
};

const genUserStocks = (userIds, stocks) => {
  const userStocksCount = 300000;
  const userStocks = [];
  for (let i = 0; i < userStocksCount; i += 1) {
    const userId = userIds[faker.random.number(userIds.length - 1)];
    const stockSymbol = stocks[faker.random.number(stocks.length - 1)][0];
    const qty = faker.random.number(10000);
    userStocks.push([userId, stockSymbol, qty]);
  }
  return userStocks;
};

const genPriceHistory = () => {
  let price = faker.random.number({ min: 1, max: 1000, precision: 0.01 });
  let trend = faker.random.number({ min: -1, max: 1, precision: 0.01 });
  const time = moment('2015-01-01 00:00:00-05');

  const priceCount = 5 * 8760 * 12;
  const prices = [];
  for (let i = 0; i < priceCount; i += 1) {
    const ts = time.format('YYYY-MM-DD HH:mm:ssZZ').substring(0, 22);
    price = Math.max(price + trend * faker.random.number({ min: 0, max: 1, precision: 0.01 }),
      0.05);
    prices.push([ts, price]);

    time.add(5, 'minutes');
    if (faker.random.number(100) > 97) {
      trend = faker.random.number({ min: -1, max: 1, precision: 0.01 });
    }
  }
  return prices;
};

module.exports = {
  genCSV,
  chainAsyncFuncCalls,
  genStockRow,
  genPriceHistoryRows,
  genStockTagRows,
  genUserRows,
  genStocks,
  genTags,
  genUsers,
  genUserStocks,
  genPriceHistory,
};
