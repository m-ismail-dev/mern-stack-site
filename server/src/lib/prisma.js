import env from '../config/env.js';

let client;

if (env.DB_CLIENT === 'postgres') {
    const { PrismaPg } = await import('@prisma/adapter-pg');
    const { PrismaClient } = await import('../generated/prisma/client.ts');
    const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
    client = new PrismaClient({ adapter });
} else if (env.DB_CLIENT === 'sqlite') {
    const { PrismaBetterSqlite3 } = await import('@prisma/adapter-better-sqlite3');
    const { PrismaClient } = await import('../generated/prisma-sqlite/client.js');
    const adapter = new PrismaBetterSqlite3({ url: env.DATABASE_URL });
    client = new PrismaClient({ adapter });
} else {
    throw new Error(`Unsupported DB_CLIENT: ${env.DB_CLIENT}`);
}

export default client;