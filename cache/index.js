const bluebird = require('bluebird');
const redis = require('redis');
const fancy = require('fancy-log');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);


const redisClient = redis.createClient({
  host: process.env.NODE_ENV === 'production' ? '172.31.15.25' : 'localhost',
});
redisClient.on('ready', () => fancy('connected to Redis'));
redisClient.on('error', fancy);

const getCacheVal = async (key) => {
  const res = await redisClient.getAsync(key);
  return res ? JSON.parse(res) : false;
};

const addCacheVal = (key, val) => redisClient.setAsync(key, JSON.stringify(val), 'EX', 60);

module.exports = {
  getCacheVal,
  addCacheVal,
};
