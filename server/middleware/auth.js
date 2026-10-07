import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const token = req.cookies?.access_token;

  if (!token) {
    return res.status(401).json({ message: 'Not logged in' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.userId = payload.sub;
    return next();
  } catch (error) {
    if (error?.name === 'JsonWebTokenError' || error?.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token invalid or expired' });
    }

    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Authentication failed' });
  }
}

export function optionalAuth(req, res, next) {
  if (req.cookies?.access_token) {
    return requireAuth(req, res, next);
  }

  req.userId = null;
  return next();
}
