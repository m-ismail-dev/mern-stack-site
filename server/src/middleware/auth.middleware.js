import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import logger from '../logger.js';
import AppError from '../utils/AppError.js';

export function requireAuth(req, res, next) {
  const token = req.cookies?.access_token;

  if (!token) {
    return next(new AppError(401, 'Not logged in'));
  }

  const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
  req.userId = payload.sub;
  return next();
}

export function optionalAuth(req, res, next) {
  if (req.cookies?.access_token) {
    return requireAuth(req, res, next);
  }

  req.userId = null;
  return next();
}
