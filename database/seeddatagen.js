const faker = require('faker');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const fancy = require('fancy-log');

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

const genStocksCSV = async (qty) => {
  const filename = 'stocks.csv';
  const csvFile = path.resolve(__dirname, 'seedFiles', filename);
  const encoding = 'utf-8';
  const writer = fs.createWriteStream(csvFile);
  let i = qty;

  const write = (cb) => {
    const symbols = [];
    let canWrite = true;
    do {
      i -= 1;
      const symbol = faker.random.alphaNumeric(5).toUpperCase();
      symbols.push(symbols);
      const name = faker.company.companyName().replace(/'|,/g, '');
      const owners = faker.random.number(20000);
      const analystHold = faker.random.number({ min: 0, max: 100, precision: 1 });
      const row = `'${symbol}','${name}',${owners},${analystHold}\n`;

      if (i % 50000 === 0) {
        fancy(`${qty - i} rows written for ${filename}`);
      }

      if (i === 0) {
        writer.write(row, encoding, () => cb([csvFile, symbols]));
      } else {
        canWrite = writer.write(row, encoding);
      }
    } while (i > 0 && canWrite);

    if (i > 0) {
      writer.once('drain', () => write(cb));
    }
  };

  return new Promise((resolve) => write(resolve));
};

const genCSV = async (filename, rowCount) => {
  const csvFile = path.resolve(__dirname, 'seedFiles', filename);
  const encoding = 'utf-8';
  const writer = fs.createWriteStream(csvFile);
  let i = rowCount;

  const write = (cb) => {
    const rowIds = [];
    let canWrite = true;
    do {
      i -= 1;
      // TODO - move below to separate func to reuse genCSV
      const symbol = faker.random.alphaNumeric(5).toUpperCase();
      const name = faker.company.companyName().replace(/'|,/g, '');
      const owners = faker.random.number(20000);
      const analystHold = faker.random.number({ min: 0, max: 100, precision: 1 });
      const row = `'${symbol}','${name}',${owners},${analystHold}\n`;
      rowIds.push(symbol);

      if (i % 50000 === 0) {
        fancy(`${rowCount - i} rows written for ${filename}`);
      }

      if (i === 0) {
        writer.write(row, encoding, () => cb(rowIds));
      } else {
        canWrite = writer.write(row, encoding);
      }
    } while (i > 0 && canWrite);

    if (i > 0) {
      writer.once('drain', () => write(cb));
    }
  };

  return new Promise((resolve) => write(resolve));
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
  genStocks,
  genStocksCSV,
  genCSV,
  genTags,
  genUsers,
  genUserStocks,
  genPriceHistory,
};
