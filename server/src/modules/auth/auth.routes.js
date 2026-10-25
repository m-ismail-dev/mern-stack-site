import { Router } from 'express';
import { requireAuth } from './auth.middleware.js';
import { register, login, refresh, logout} from './auth.controller.js';
import { registerSchema, loginSchema } from './auth.schema.js';
import validate from '../../middleware/validate.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
