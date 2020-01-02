const { Client } = require('cassandra-driver');
const fancy = require('fancy-log');
const { clientOptions } = require('./authcs');

const createConn = async () => {
  const client = new Client(clientOptions);

  return client;
};

module.exports = {
  dbClient: createConn().catch(fancy),
};
