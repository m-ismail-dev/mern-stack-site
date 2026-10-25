import env from '../config/env.js';
import Redis from 'ioredis';
export default new Redis(env.REDIS_URL);
