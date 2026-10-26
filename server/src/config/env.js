import 'dotenv/config';
import { z } from 'zod';

const result = z.object({
    DB_CLIENT: z.enum(['postgres', 'sqlite']).default('sqlite'),
    POSTGRES_URL: z.url({ protocol: /^postgres(ql)?$/ }).optional(),
    SQLITE_URL: z.string().startsWith('file:').default('file:./dev.db'),

    // ...the rest of your fields unchanged...
})
.refine(ctx => ctx.DB_CLIENT !== 'postgres' || ctx.POSTGRES_URL, {
    path: ['POSTGRES_URL'],
    error: 'POSTGRES_URL is required when DB_CLIENT is postgres',
})
.refine(ctx => !ctx.REDIS_ENABLED || ctx.REDIS_URL, {
    path: ['REDIS_URL'],
    error: 'REDIS_URL is required when REDIS_ENABLED is true',
})
.transform(env => ({
    ...env,
    DATABASE_URL: env.DB_CLIENT === 'postgres' ? env.POSTGRES_URL : env.SQLITE_URL,
}))
.safeParse(process.env);

if (!result.success) {
    console.error("Invalid environment:", z.flattenError(result.error).fieldErrors);
    process.exit(1);
}

export default result.data;