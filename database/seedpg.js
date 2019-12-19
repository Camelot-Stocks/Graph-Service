/* eslint-disable no-console */
// const fs = require('fs');
// const path = require('path');
// const auth = require('./auth');
const { db, createDbTables } = require('./index');

const seed = async (dbConn) => {
  const conn = await dbConn;
  await createDbTables(conn);
  console.log('db tables created');

  await conn.end();
};

seed(db).catch(console.log);
