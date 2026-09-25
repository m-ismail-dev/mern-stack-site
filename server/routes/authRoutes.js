import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { register, login, refresh, logout, me } from '../controllers/authController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

export default router;
