const { dbConn } = require('./indexcs');

const seed = async () => {
  await dbConn;
};

seed();
