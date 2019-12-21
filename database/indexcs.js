const { Client } = require('cassandra-driver');
const fancy = require('fancy-log');

const createConn = async () => {
  const clientOptions = {
    contactPoints: ['localhost'],
    localDataCenter: 'datacenter1',
    keyspace: 'stock_history',
  };
  const client = new Client(clientOptions);
  await client.connect();
  fancy('db connected');
};

module.exports = {
  dbConn: createConn().catch(fancy),
};
