import env from '../config/env.js';
import redis from '../lib/redis.js';
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';

export const globalLimiter = rateLimit({
    store: new RedisStore({ sendCommand: (...args) => redis.call(...args), prefix: 'rl:global:'}),
    max: env.RATE_LIMIT_GLOBAL_MAX,
    windowMs: env.RATE_LIMIT_GLOBAL_WINDOW
});

export const apiLimiter = rateLimit({
    store: new RedisStore({ sendCommand: (...args) => redis.call(...args), prefix: 'rl:api:'}),
    max: env.RATE_LIMIT_API_MAX,
    windowMs: env.RATE_LIMIT_API_WINDOW
});

export const authLimiter = rateLimit({
    store: new RedisStore({ sendCommand: (...args) => redis.call(...args), prefix: 'rl:auth:'}),
    max: env.RATE_LIMIT_AUTH_MAX,
    windowMs: env.RATE_LIMIT_AUTH_WINDOW
});
