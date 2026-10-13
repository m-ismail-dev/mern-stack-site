import 'dotenv/config'
import { z } from 'zod';

const parsed = z.object({
    DATABASE_URL: z.string().min(1),

    // example secrets by default
    JWT_ACCESS_SECRET: z.string().min(16).default("a54165045007496c15ce0365819f90ebac16d8fa6c554ffe2097282f210bfcad"),
    JWT_REFRESH_SECRET: z.string().min(16).default("14eeb93503c4ae69efe0a07dd5c2b43abfb854d999dfe27a6367b462ada2c16f"),
    JWT_ACCESS_EXPIRY: z.string().default("15m"),
    JWT_REFRESH_EXPIRY: z.string().default("7d"),
    JWT_REFRESH_EXPIRY_REMEMBER: z.string().default("30d"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(3000),
    CLIENT_URL: z.string().min(1).default("http://localhost:5173")
}).safeParse(process.env)

if (!parsed.success) {
    console.error("Invalid environment:", parsed.error.flatten().fieldErrors)
}

export default parsed.data;
