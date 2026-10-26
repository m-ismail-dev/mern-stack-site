import env from '../config/env.js';
import Redis from 'ioredis';

export default env.REDIS_ENABLED && env.REDIS_URL
  ? new Redis(env.REDIS_URL)
  : null;