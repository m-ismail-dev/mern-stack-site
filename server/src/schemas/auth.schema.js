import { z } from 'zod';

export const registerSchema = z.object({ body: z.object({
    email: z.email().trim().toLowerCase(),
    password: z.string.min(8).max(72),
    firstName: z.string().trim().min(2).max(50),
    lastName: z.string().trim().min(2).max(50).optional(),
    role: z.enum(['CUSTOMER', 'PROVIDER']).default('CUSTOMER'),
    phone: z.string().trim().regex(/^\+?[0-9]{8,15}$/)
})});

export const loginSchema = z.object({ body: z.object({
    email: z.email().trim().toLowerCase(),
    password: z.string().min(1)
})});
