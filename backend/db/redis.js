const redis = require('redis');


const createRedisConfig = (env = process.env) => ({
  socket: {
    host: env.REDIS_HOST || 'localhost',
    port: parseInt(env.REDIS_PORT || '6379'),
  },
  password: env.REDIS_PASSWORD || undefined,
});

// Create Redis client
const createRedisClient = async (config) => {
  const client = redis.createClient(config);
  
  client.on('error', (err) => console.error('Redis Client Error:', err));
  client.on('connect', () => console.log('Redis Client Connected'));
  
  await client.connect();
  return client;
};

// Initialize Redis client
let redisClient;

const getRedisClient = async () => {
  if (!redisClient) {
    redisClient = await createRedisClient(createRedisConfig());
  }
  return redisClient;
};

// Redis operations - Functional wrappers
const set = (client) => async (key, value, expirySeconds) => {
  const options = expirySeconds ? { EX: expirySeconds } : {};
  return await client.set(key, value, options);
};

const get = (client) => async (key) => {
  return await client.get(key);
};

const del = (client) => async (...keys) => {
  return await client.del(keys);
};

const exists = (client) => async (key) => {
  return await client.exists(key);
};

const setEx = (client) => async (key, seconds, value) => {
  return await client.setEx(key, seconds, value);
};

// Blacklist operations for JWT tokens
const addToBlacklist = async (token, expirySeconds) => {
  const client = await getRedisClient();
  return await set(client)(`blacklist:${token}`, '1', expirySeconds);
};

const isBlacklisted = async (token) => {
  const client = await getRedisClient();
  const result = await exists(client)(`blacklist:${token}`);
  return result === 1;
};

// Token family tracking for rotation
const storeTokenFamily = async (tokenFamily, userId, expirySeconds) => {
  const client = await getRedisClient();
  return await setEx(client)(`token_family:${tokenFamily}`, expirySeconds, userId);
};

const getTokenFamily = async (tokenFamily) => {
  const client = await getRedisClient();
  return await get(client)(`token_family:${tokenFamily}`);
};

const revokeTokenFamily = async (tokenFamily) => {
  const client = await getRedisClient();
  return await del(client)(`token_family:${tokenFamily}`);
};

// Graceful shutdown
const closeRedisClient = async () => {
  if (redisClient) {
    await redisClient.quit();
    console.log('Redis client closed');
  }
};

module.exports = {
  getRedisClient,
  addToBlacklist,
  isBlacklisted,
  storeTokenFamily,
  getTokenFamily,
  revokeTokenFamily,
  closeRedisClient,
};
