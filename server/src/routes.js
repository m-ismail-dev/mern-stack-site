import { Router } from 'express';
import authRouter from './modules/auth/auth.routes.js';
import usersRouter from './modules/users/users.routes.js';
import { apiLimiter, authLimiter } from './middleware/rateLimiter.middleware.js';

const router = Router();
router.use(apiLimiter);
router.get('/health', (req, res) => res.json({ status: 'ok' }));
router.use('/auth', authLimiter, authRouter);
router.use('/users', usersRouter);

export default router;