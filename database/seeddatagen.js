const faker = require('faker');
const moment = require('moment');

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
// console.log(moment('2015-01-01 00:00:00-05').format('YYYY-MM-DD HH:mm:ssZZ').substring(0, 22));
const genPriceHistory = (priceCount) => {
  const prices = [];
  let price = faker.random.number({ min: 1, max: 1000, precision: 0.01 });
  const trend = faker.random.number({ min: -1, max: 1, precision: 0.01 });

  const start = moment('2015-01-01 00:00:00-05');
  for (let i = 0; i < priceCount; i += 1) {
    const ts = start.format('YYYY-MM-DD HH:mm:ssZZ').substring(0, 22);
    price += trend * faker.random.number({ min: 0, max: 0.1, precision: 0.01 });
    prices.push([ts, price]);
    start.add(5, 'minutes');
  }
  return prices;
};

// create users

// create user_stocks

module.exports = {
  genStocks,
  genPriceHistory,
};
