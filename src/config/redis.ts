import { Redis, RedisOptions } from 'ioredis';

import { getEnv } from '../utils/helpers';

import logger from './logger';

const redisOption: RedisOptions = {
  retryStrategy(times) {
    if (times >= 5) return;
    return times;
  },
};

const redisClient = new Redis(getEnv('REDIS_URI'), redisOption);
redisClient.on('error', async (error: Error) => {
  logger.error(new Error(`REDIS_${error.message}`));
});

export default redisClient;
