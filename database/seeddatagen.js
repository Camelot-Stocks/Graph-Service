const faker = require('faker');

const genStocks = (qty) => {
  const stocks = [];
  for (let i = 0; i < qty; i += 1) {
    const name = faker.lorem.words(3);
    const symbol = faker.random.alphaNumeric(5).toUpperCase();
    const analystHold = faker.random.number({ min: 0, max: 100, precision: 1 });
    stocks.push([name, symbol, analystHold]);
  }
  return stocks;
};

// create tags

// create stock_tags

// create prices
const genPriceHistory = (startVal, dir) => {
  const prices = [];
  return prices;
};

// create users

// create user_stocks

module.exports = {
  genStocks,
  genPriceHistory,
};
