const { createClient } = require('redis');

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const redisClient = createClient({ url: redisUrl });

redisClient.on('error', (error) => {
  console.error('Redis error:', error);
});

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log(`Connected to Redis: ${redisUrl}`);
  }
}

async function getCache(key) {
  if (!redisClient.isOpen) {
    throw new Error('Redis client is not connected.');
  }
  return redisClient.get(key);
}

async function setCache(key, value, ttlSeconds = 60) {
  if (!redisClient.isOpen) {
    throw new Error('Redis client is not connected.');
  }
  await redisClient.setEx(key, ttlSeconds, value);
}

async function disconnectRedis() {
  if (redisClient.isOpen) {
    await redisClient.disconnect();
    console.log('Redis connection closed.');
  }
}

module.exports = {
  connectRedis,
  getCache,
  setCache,
  disconnectRedis,
};
