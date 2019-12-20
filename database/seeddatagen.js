const faker = require('faker');

const genStocks = (qty) => {
  const stocks = [];
  for (let i = 0; i < qty; i += 1) {
    const symbol = faker.random.alphaNumeric(5).toUpperCase();
    const name = faker.lorem.words(3);
    const analystHold = faker.random.number({ min: 0, max: 100, precision: 1 });
    stocks.push([symbol, name, analystHold]);
  }
  return stocks;
};

// create tags

// create stock_tags

// create prices
const genPriceHistory = (priceCount) => {
  const prices = [];
  let price = faker.random.number({ min: 1, max: 1000, precision: 0.01 });
  const trend = faker.random.number({ min: -1, max: 1, precision: 0.01 });
  // TODO - increment timestamps
  let ts = '2014-12-20 05:40:00';
  for (let i = 0; i < priceCount; i += 1) {
    price += trend * faker.random.number({ min: 0, max: 0.1, precision: 0.01 });
    prices.push([ts, price]);
  }
  return prices;
};

// create users

// create user_stocks

module.exports = {
  genStocks,
  genPriceHistory,
};
