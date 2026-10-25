import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { register, login, refresh, logout, me } from '../controllers/auth.controller.js';
import validate from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js'

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

export default router;
