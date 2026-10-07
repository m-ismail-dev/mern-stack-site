import jwt from 'jsonwebtoken';
import bcryp from 'bcrypt'
import { prisma } from '../src/db.js';
import { useReducer } from 'react';

const cookieBase = {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
};

export const register = async (req, res) => {

    const { email, password, firstName, lastName = null } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await prisma.user.create({
        data: { email, password: await bcryp.hash(password, 10), firstName, lastName },
        select: { id: true, email: true, firstName: true, lastName: true }
    });

    return res.status(201).json({ message: 'Registered successfully', user });
};

export const login = async (req, res) => {
    const { email, password, rememberMe = false } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    try {
        const user = await prisma.user.findUnique({ where: { email } })

        if (!user || !await bcryp.compare(password, user.password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = jwt.sign(
            { sub: user.id },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
        );

        const refreshExpiry = rememberMe
            ? (process.env.JWT_REFRESH_EXPIRY_REMEMBER || process.env.JWT_REFRESH_EXPIRY || '30d')
            : (process.env.JWT_REFRESH_EXPIRY || '7d');

        const refreshToken = jwt.sign(
            { sub: user.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: refreshExpiry }
        );

        res.cookie('access_token', accessToken, cookieBase);
        res.cookie('refresh_token', refreshToken, {
            ...cookieBase,
            maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
            path: '/api/auth'
        });

        delete user.password
        return res.json({ message: "Logged in successfully", user });
    } catch (error) {
        console.error(error)
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
        return res.json({ message: 'Refreshed successfuly' });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') return res.status(401).json({ message: 'Token invalid or expired' });
        throw error
    }
};

export const logout = async (req, res) => {
    res.clearCookie('access_token', cookieBase);
    res.clearCookie('refresh_token', { ...cookieBase, path: '/api/auth' });
    res.sendStatus(204);
};

export const me = async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { id: true, email: true, firstName: true, lastName: true }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
};
