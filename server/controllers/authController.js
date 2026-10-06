import jwt from 'jsonwebtoken';
import bcryp from 'bcrypt'
import { prisma } from '../src/db.js';

const cookieBase = {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
};

export const register = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });

    try {
        const user = await prisma.user.create({
            data: { username, password: bcryp.hash(password) }
        });
        return res.status(201).json({ username: user.username });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ message: 'Username already exists' });
        else if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
        else return res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req, res) => {
    const { username, password, rememberMe } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });

    try {
        const user = prisma.user.findUnique({ where: { username } })

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = jwt.sign(
            { sub: user._id.toString() },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
        );

        const refreshExpiry = rememberMe
            ? (process.env.JWT_REFRESH_EXPIRY_REMEMBER || process.env.JWT_REFRESH_EXPIRY || '30d')
            : (process.env.JWT_REFRESH_EXPIRY || '7d');

        const refreshToken = jwt.sign(
            { sub: user._id.toString() },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: refreshExpiry }
        );

        res.cookie('access_token', accessToken, cookieBase);
        res.cookie('refresh_token', refreshToken, {
            ...cookieBase,
            maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
            path: '/api/auth'
        });

        return res.json({ username: user.username, rememberMe: !!rememberMe });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const refresh = async (req, res) => {
    const token = req.cookies.refresh_token;
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    try {
        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const accessToken = jwt.sign(
            { sub: payload.sub },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
        );

        res.cookie('access_token', accessToken, cookieBase);
        return res.json({ ok: true });
    } catch {
        return res.status(401).json({ message: 'Token invalid or expired' });
    }
};

export const logout = async (req, res) => {
    res.clearCookie('access_token', cookieBase);
    res.clearCookie('refresh_token', { ...cookieBase, path: '/api/auth' });
    res.sendStatus(204);
};

export const me = async (req, res) => {
    const user = prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ username: user.username });
};
