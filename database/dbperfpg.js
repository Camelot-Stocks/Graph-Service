const fancy = require('fancy-log');
const { db } = require('./index');

const benchmarkDB = async (dbConn) => {
  const conn = await dbConn;
  fancy.info('tests starting...');

  const stocks = [
    'PN93O',
    'TQ9G2',
    'BZTWU',
    'WG6J9',
    'PM2KO',
    '9BJW5',
    '2PEQ3',
    'I32R1',
    'JD6Z0',
    'SMJP5',
    'RRPF3',
    'GPE0Q',
    'PEUMC',
    'AF155',
    'BUF6F',
    '5AIKJ',
    'DQQ7T',
    'Y0TJW',
    '5B2S9',
    'R8KH7',
    'USHEE',
    'YQKWS',
    '3GOP0',
    'ZK45M',
    'RFFA0',
    'QZ8L7',
    '9ZI34',
    'KV9FW',
    'BP8RF',
    'WAPOQ',
    'IWJGL',
    'UTR5O',
    'SK6G2',
    'H9Q9K',
    'ONCDF',
    'Z9CQ8',
    'RDFMU',
    '3J2WX',
    '2KFEE',
    '2TUUW',
    '3T6JQ',
    'F393G',
    'G03FU',
    'DWURV',
    'HRBTD',
    'HRBTD',
    'KSH0G',
    'FW9YZ',
    'RH5BA',
    'DBQ6H',
    '6X64V',
    'TW92J',
    '2OUUX',
    '75BK0',
    'VRUH4',
    'BJKXX',
    'SLXRE',
    'SAF98',
    '4QZGK',
    'VSRTQ',
    '7I5AR',
    'SIBNZ',
    'VZ1JE',
    'GIT7P',
    'JCQT0',
    '7QAXJ',
    '5AWLB',
    'R6BH9',
    'RA08G',
    'RBW8Y',
    'YBCPH',
    'BVNY6',
    'I0TNO',
    'KVED5',
    'FFA66',
    '9X4ZQ',
    'OAMQY',
    'S5PJV',
    '3S64I',
    'SFW2E',
    'TXUD8',
    'ALYLW',
    'AWLQ5',
    'OKSP2',
    'XGUKR',
    'NZMW0',
    '4GM4B',
    '9PFJT',
    'E0LU3',
    'Z32LA',
    '6YRUL',
    'TV09Q',
    'NYIUP',
    'EGRFK',
    'MPV7F',
    'R9GTT',
    'CSTIV',
    'J7R1O',
    'M3CNP',
    'HIC18',
    'L6MNB',
    '1CRJX',
    'MD35X',
    'D5SMU',
    'YAUD7',
    '63NH2',
    'TK9GN',
    'CK2F6',
    'HC4PV',
    'OPOHE',
    '8TOAW',
    '81T2M',
    '24UF9',
    '0FIGA',
    'E9CQ1',
    '6ZZ9V',
    'MR358',
    'TB8LN',
    '7X7ZA',
    'WL2ET',
    '9HV2H',
    '427J7',
    'YKOBD',
    'NUMGP',
    'OP0CP',
    'SJVAK',
    'KEMLW',
    'LUZNF',
    '1TYQD',
    'GN3R6',
    'HPBQC',
    'G2FGJ',
    'K0RX3',
    'WMAVN',
    'UH61D',
    'H87JZ',
    'R3ZVY',
    '6KG3U',
    '8FODR',
    'LZSOU',
    '8H17M',
    '6BVQN',
    'B8YY4',
    'T044O',
    '3IDX1',
    '1663H',
    'G95ZG',
    'Y60OR',
    '49ILY',
    '05MIH',
    'XADCV',
    '2TN0U',
    'YAITX',
    'G9ITO',
    '344IR',
    'YTQRP',
    '9S74A',
    'FSWMJ',
    'M08LF',
    'QX49C',
    'NURZC',
    'PMMMU',
    '2WCER',
    'YX9AU',
    'P3QDG',
    '6OUB9',
    'EAFJW',
    'UMVXD',
    'K40RO',
    'R1EYZ',
    'ZJBUI',
    'DQ4JR',
    'Z3H06',
    'PKP4O',
    'LZL4Y',
    'WTC07',
    '3MMGW',
    'ZSEU8',
    'ISZ00',
    'XGSKR',
    'FG0I1',
    'IOML0',
    'S18L7',
    'Z3HJ7',
    'T9E64',
    'QSD4S',
    'W2BP9',
    'J69B3',
    'PDD7S',
    'CIBN8',
    'CUALP',
    '7C3WC',
    'Z6TOI',
    'D6C4R',
    '628EC',
    'J0JZZ',
    'V5U9T',
    '6ESNG',
    'QDO5H',
    'EEWKA',
    'NAAC9',
  ];
  const stock = stocks[Math.floor(Math.random() * 200)];

  try {
    const query = `SELECT ts,price FROM prices WHERE stock_symbol='${stock}' AND ts > '2019-12-30';`;
    let start = process.hrtime();
    await conn.query(query);
    let end = process.hrtime(start);
    fancy.info(`1D query time first exec: ${end[1] / 1000000}ms`);
    start = process.hrtime();
    await conn.query(query);
    end = process.hrtime(start);
    fancy.info(`1D query time next exec: ${end[1] / 1000000}ms`);
  } catch (error) {
    fancy.error(error);
  }

  try {
    const query = `SELECT ts,price FROM prices WHERE stock_symbol='${stock}' AND ts > '2019-12-24' AND extract_min(ts) IN (0, 10, 20, 30, 40, 50)`;
    let start = process.hrtime();
    await conn.query(query);
    let end = process.hrtime(start);
    fancy.info(`1W query time first exec: ${end[1] / 1000000}ms`);
    start = process.hrtime();
    await conn.query(query);
    end = process.hrtime(start);
    fancy.info(`1W query time next exec: ${end[1] / 1000000}ms`);
  } catch (error) {
    fancy.error(error);
  }

  try {
    const query = `SELECT ts,price FROM prices WHERE stock_symbol='${stock}' AND ts > '2019-11-30' AND extract_min(ts) = 0;`;
    let start = process.hrtime();
    await conn.query(query);
    let end = process.hrtime(start);
    fancy.info(`1M query time first exec: ${end[1] / 1000000}ms`);
    start = process.hrtime();
    await conn.query(query);
    end = process.hrtime(start);
    fancy.info(`1M query time next exec: ${end[1] / 1000000}ms`);
  } catch (error) {
    fancy.error(error);
  }

  try {
    const query = `SELECT ts,price FROM prices WHERE stock_symbol='${stock}' AND ts > '2018-12-31' AND extract_min(ts) = 0 AND extract_hour(ts) = 17;`;
    let start = process.hrtime();
    await conn.query(query);
    let end = process.hrtime(start);
    fancy.info(`1Y query time first exec: ${end[1] / 1000000}ms`);
    start = process.hrtime();
    await conn.query(query);
    end = process.hrtime(start);
    fancy.info(`1Y query time next exec: ${end[1] / 1000000}ms`);
  } catch (error) {
    fancy.error(error);
  }

  try {
    const query = `SELECT ts,price FROM prices WHERE stock_symbol='${stock}' AND ts > '2014-12-31' AND extract_min(ts) = 0 AND extract_hour(ts) = 17 AND extract_dow(ts) = 1;`;
    let start = process.hrtime();
    await conn.query(query);
    let end = process.hrtime(start);
    fancy.info(`5Y query time first exec: ${end[1] / 1000000}ms`);
    start = process.hrtime();
    await conn.query(query);
    end = process.hrtime(start);
    fancy.info(`5Y query time next exec: ${end[1] / 1000000}ms`);
  } catch (error) {
    fancy.error(error);
  }

  fancy.info('...tests complete');
  conn.end();
};

benchmarkDB(db).catch(fancy);
