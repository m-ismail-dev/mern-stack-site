import env from '../config/env.js';
import redis from '../lib/redis.js';
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';

const createRateLimiter = ({ prefix, max, windowMs, skip }) =>
    rateLimit({
        store: new RedisStore({
            sendCommand: (...args) => redis.call(...args),
            prefix
        }),
        max,
        windowMs,
        skip,
        standardHeaders: true,
        legacyHeaders: false,
        statusCode: 429,
        handler: (req, res) => res.status(429).json({ message: 'Too many requests, please try again later' })
    });

export const globalLimiter = createRateLimiter({
    prefix: 'rl:global:',
    max: env.RATE_LIMIT_GLOBAL_MAX,
    windowMs: env.RATE_LIMIT_GLOBAL_WINDOW,
    skip: req => req.path.startsWith('/api')
});

export const apiLimiter = createRateLimiter({
    prefix: 'rl:api:',
    max: env.RATE_LIMIT_API_MAX,
    windowMs: env.RATE_LIMIT_API_WINDOW,
    skip: req => req.path.startsWith('/api/auth')
});

export const authLimiter = createRateLimiter({
    prefix: 'rl:auth:',
    max: env.RATE_LIMIT_AUTH_MAX,
    windowMs: env.RATE_LIMIT_AUTH_WINDOW
});
