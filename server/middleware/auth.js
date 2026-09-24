import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json({ message: 'Not logged in' });

    try {
        req.userId = jwt.verify(token, process.env.JWT_ACCESS_SECRET).sub;
        next()
    } catch {
        res.status(401).json({ message: 'Token invalid or expired'})
    }
}

export function optionalAuth(req, res, next) {
    // if there is a token, it must be valid
    if (req.cookies.access_token) return requireAuth(req, res, next);

    // otherwise continue as anonymous user
    req.userId = null;
    next();
}