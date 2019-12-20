const faker = require('faker');

const genStock = () => {
  const name = faker.lorem.word();
  const symbol = faker.random.alphaNumeric(5).toUpperCase();
  const analystHold = faker.random.number({ min: 0, max: 100, precision: 1 });
  return [name, symbol, analystHold];
};

// create tags

// create stock_tags

// create prices

// create users

// create user_stocks

module.exports = {
  genStock,
};
