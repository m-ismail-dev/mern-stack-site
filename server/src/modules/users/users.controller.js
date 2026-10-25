import prisma from '../../lib/prisma.js';
import AppError from '../../utils/AppError.js';
import cache from '../../lib/cache.js';

export const getMe = async (req, res, next) => {
    const raw = await cache.get(`user:${req.userId}`);
    if (raw) return res.json({ user: JSON.parse(raw) });

    const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { id: true, email: true, firstName: true, lastName: true }
    });
    if (!user) {
        return next(new AppError(404, 'User not found'));
    }
    cache.set(`user:${req.userId}`, JSON.stringify(user));
    
    return res.json({ user });
};
