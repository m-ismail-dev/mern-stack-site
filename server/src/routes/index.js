import { Router } from 'express';
import authRouter from './auth.routes.js';

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));
router.use('/auth', authRouter);

export default router;