import jwt from 'jsonwebtoken';
import bcryp from 'bcrypt';
import prisma from '../lib/prisma.js';
import env from '../config/env.js';
import logger from '../logger.js';
import AppError from '../utils/AppError.js';

const cookieBase = {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    path: '/'
};

export const register = async (req, res, next) => {
    const { email, password, firstName, lastName, role, phone } = req.body;

    if (!email || !password) {
        return next(new AppError(400, 'Email and password are required'));
    }

    let user = await prisma.user.create({
        data: { email, passwordHash: await bcryp.hash(password, 10), firstName, lastName, role, phone },
        omit: { passwordHash: true }
    });

    return res.status(201).json({ message: 'Registered successfully', user });
};

export const login = async (req, res, next) => {
    const { email, password, rememberMe = false } = req.body;

    if (!email || !password) {
        return next(new AppError(400, 'Email and password are required'));
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcryp.compare(password, user.passwordHash))) {
        return next(new AppError(401, 'Invalid credentials'));
    }

    const accessToken = jwt.sign(
        { sub: user.id },
        env.JWT_ACCESS_SECRET,
        { expiresIn: env.JWT_ACCESS_EXPIRY }
    );

    const refreshExpiry = rememberMe
        ? (env.JWT_REFRESH_EXPIRY_REMEMBER)
        : (env.JWT_REFRESH_EXPIRY);

    const refreshToken = jwt.sign(
        { sub: user.id },
        env.JWT_REFRESH_SECRET,
        { expiresIn: refreshExpiry }
    );

    res.cookie('access_token', accessToken, cookieBase);
    res.cookie('refresh_token', refreshToken, {
        ...cookieBase,
        maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
        path: '/api/auth/refresh'
    });

    const { passwordHash, ...safeUser } = user;

    return res.json({ message: 'Logged in successfully', user: safeUser });
};

export const refresh = async (req, res, next) => {
    const token = req.cookies.refresh_token;

    if (!token) {
        return next(new AppError(401, 'No refresh token'));
    }

    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign(
        { sub: payload.sub },
        env.JWT_ACCESS_SECRET,
        { expiresIn: env.JWT_ACCESS_EXPIRY || '15m' }
    );

    res.cookie('access_token', accessToken, cookieBase);
    return res.json({ message: 'Refreshed successfuly' });
};

export const logout = async (req, res) => {
    res.clearCookie('access_token', cookieBase);
    res.clearCookie('refresh_token', { ...cookieBase, path: '/api/auth/refresh' });
    res.sendStatus(204);
};

export const me = async (req, res, next) => {
    const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { id: true, email: true, firstName: true, lastName: true }
    });

    if (!user) {
        return next(new AppError(404, 'User not found'));
    }

    return res.json({ user });
};
