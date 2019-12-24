const {
  Worker, isMainThread, parentPort, workerData,
} = require('worker_threads');
const { genPriceHistoryRows } = require('./seeddatagen');

if (isMainThread) {
  module.exports = {
    genPriceHistoryRowsAsync: (symbol) => new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: symbol,
      });
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
      });
    }),
  };
} else {
  const symbol = workerData;
  parentPort.postMessage(genPriceHistoryRows(symbol));
}
