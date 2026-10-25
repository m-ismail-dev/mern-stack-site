import env from '../config/env.js';
import Redis from 'ioredis';
export default Redis(env.REDIS_URL);
