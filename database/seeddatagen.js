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

const genPriceHistory = () => {
  let price = faker.random.number({ min: 1, max: 1000, precision: 0.01 });
  let trend = faker.random.number({ min: -1, max: 1, precision: 0.01 });
  const time = moment('2015-01-01 00:00:00-05');

  const priceCount = 5 * 8760 * 12;
  const prices = [];
  for (let i = 0; i < priceCount; i += 1) {
    const ts = time.format('YYYY-MM-DD HH:mm:ssZZ').substring(0, 22);
    price += trend * faker.random.number({ min: 0, max: 1, precision: 0.01 });
    prices.push([ts, price]);

    time.add(5, 'minutes');
    if (faker.random.number(100) > 97) {
      trend = faker.random.number({ min: -1, max: 1, precision: 0.01 });
    }
  }
  return prices;
};

// create users

// create user_stocks

module.exports = {
  genStocks,
  genTags,
  genPriceHistory,
};
