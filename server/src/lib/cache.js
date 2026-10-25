import env from '../config/env.js';
import redis from './redis.js';

export default {
    get: key => redis.get(`cache:${key}`),
    set: (key, value, ttl = env.CACHE_DEFAULT_TTL) => redis.set(`cache:${key}`, value, 'EX', ttl),
    del: key => redis.del(`cache:${key}`)
}
