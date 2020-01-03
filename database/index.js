const { Pool, Client } = require('pg');
const fs = require('fs');
const path = require('path');
const fancy = require('fancy-log');
const auth = require('./auth');

const createDbConn = async (scopeAuth) => {
  const env = process.env.NODE_ENV || 'dev';
  const {
    user, password, host, port,
  } = scopeAuth[env];

  const client = new Client({
    host,
    port,
    database: 'postgres',
    user,
    password,
  });

  const database = `stockhistory_${env}`;
  try {
    const query = `CREATE DATABASE ${database};`;
    await client.connect();
    await client.query(query);
    await client.end();
  } catch (error) {
    if (error.code !== '42P04') {
      // print error if error not for db already exists
      fancy(error);
    }
    await client.end();
  }

  const pool = new Pool({
    host,
    port,
    database,
    user,
    password,
    // max: 20,
    // idleTimeoutMillis: 30000,
    // connectionTimeoutMillis: 2000,
  });
  pool.on('error', fancy);

  try {
    const res = await pool.query('SELECT NOW()');
    fancy(`Postgres connected for '${env}' env to pool for database '${database}' at ${res.rows[0].now}`);
  } catch (error) {
    fancy(`error creating pool for database '${database}'`);
    fancy(error);
  }

  return pool;
};

const createDbTables = (conn) => {
  const schemaFile = path.resolve(__dirname, 'schema.sql');
  const createDBQuery = fs.readFileSync(schemaFile).toString();

  return conn.query(createDBQuery);
};

const cleanDbTables = (conn) => {
  const query = `
    TRUNCATE TABLE user_stocks CASCADE;
    TRUNCATE TABLE users CASCADE;
    TRUNCATE TABLE prices CASCADE;
    TRUNCATE TABLE stock_tags CASCADE;
    TRUNCATE TABLE tags CASCADE;
    TRUNCATE TABLE stocks CASCADE;
  `;
  return conn.query(query);
};

module.exports = {
  db: createDbConn(auth).catch(fancy),
  createDbTables,
  cleanDbTables,
};
