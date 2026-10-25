import 'dotenv/config';
import { z } from 'zod';

const result = z.object({
    DATABASE_URL: z.string().min(1),
    REDIS_URL: z.string().min(1),

    // example secrets by default
    JWT_ACCESS_SECRET: z.string().min(16).default("a54165045007496c15ce0365819f90ebac16d8fa6c554ffe2097282f210bfcad"),
    JWT_REFRESH_SECRET: z.string().min(16).default("14eeb93503c4ae69efe0a07dd5c2b43abfb854d999dfe27a6367b462ada2c16f"),
    JWT_ACCESS_EXPIRY: z.string().default("15m"),
    JWT_REFRESH_EXPIRY: z.string().default("7d"),
    JWT_REFRESH_EXPIRY_REMEMBER: z.string().default("30d"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(3000),
    CLIENT_URL: z.string().min(1).default("http://localhost:5173"),
    ADMIN_EMAIL: z.string().min(1).default("adminemail@example.com"),
    ADMIN_PASSWORD: z.string().min(1).default("example admin password"),
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug', 'silly']).default('info'),
    RATE_LIMIT_GLOBAL_MAX: z.coerce.number().default(300),
    RATE_LIMIT_GLOBAL_WINDOW: z.coerce.number().default(60_000),
    RATE_LIMIT_API_MAX: z.coerce.number().default(100),
    RATE_LIMIT_API_WINDOW: z.coerce.number().default(60_000),
    RATE_LIMIT_AUTH_MAX: z.coerce.number().default(10),
    RATE_LIMIT_AUTH_WINDOW: z.coerce.number().default(900_000),
    CACHE_DEFAULT_TTL: z.coerce.number().default(3600)
}).safeParse(process.env)

if (!result.success) {
    console.error("Invalid environment:", result.error.flatten().fieldErrors);
    process.exit(1);
}

export default result.data;
