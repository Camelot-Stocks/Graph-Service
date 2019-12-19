/* eslint-disable no-console */
const { Pool, Client } = require('pg');
// const fs = require('fs');
// const path = require('path');
const auth = require('./auth');

const createDbConn = async (scopeAuth) => {
  const env = process.env.NODE_ENV || 'dev';
  const {
    user, password, host, port,
  } = scopeAuth[env];

  const client = new Client({
    host,
    user,
    password,
    port,
  });

  const database = `stockHistory_${env}`;
  const query = `CREATE DATABASE IF NOT EXISTS ${database};`;
  try {
    await client.connect();
    await client.query(query);
    await client.end();
  } catch (error) {
    console.log(error);
    await client.end();
  }

  const pool = new Pool({
    host,
    user,
    password,
    database,
    // TODO - investigate options below
    // multipleStatements: true,
    // connectionLimit: 100,
    // queueLimit: 0,
  });
  try {
    const res = await pool.query('SELECT NOW()');
    console.log(`MySQL connected for '${env}' env to pool for database '${database}' at ${res}`);
  } catch (error) {
    console.log(`error creating pool for database '${database}'`);
    console.log(error);
  }

  return pool;
};

// const createDbTables = (conn) => {
//   const schemaFile = path.resolve(__dirname, 'schema.sql');
//   const createDBQuery = fs.readFileSync(schemaFile).toString();

//   return conn.query(createDBQuery);
// };

// const cleanDbTables = (conn) => {
//   const query = `
//     SET FOREIGN_KEY_CHECKS = 0;

//     TRUNCATE TABLE rates;
//     TRUNCATE TABLE lenders;
//     TRUNCATE TABLE properties;
//     TRUNCATE TABLE zips;

//     SET FOREIGN_KEY_CHECKS = 1;
//   `;
//   return conn.query(query);
// };

module.exports = {
  dbConn: createDbConn(auth).catch(console.log),
  // createDbTables,
  // cleanDbTables,
};
