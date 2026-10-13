import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts';
import env from '../config/env.js';

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL })
export default new PrismaClient({ adapter })
