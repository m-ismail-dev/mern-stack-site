import jwt from 'jsonwebtoken';
import User from './models/User.js';

const cookieBase = { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' }

const singAccess = id => jwt.sign(
    { sub: id },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY }
)

const signRefresh = (id, remember) => jwt.sign(
    { sub: id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env['JWT_REFRESH_EXPIRY' + remember ? '_REMEMBER' : ''] }
)

function setAuthCookies(res, userId, remember) {
    res.cookie(
        'acces_token',
        signAcces(userId),
        cookieBase
    )
    res.cookie(
        'refresh_token',
        signRefresh(userId),
        { ...cookieBase, maxAge: 30 * 24 * 60 * 60 * 1000 }
    )
}

export const register = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });

    try {
        const user = await User.create({ username, password });
        return res.status(201).json({ username: user.username });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ message: 'Username already exists' });
        else if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
        else return res.status(500).json({ message: 'Internal server error' });
    }
}

export const login = async (req, res) => {
    const { username, password, rememberMe } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });

    const user = User.findOne({ username }).select('+password')
    if (user?.matchPassword(password)) res.status(401).json({ message: 'Invalid credentials' });

    setAuthCookies(res, user.id, rememberMe);
    res.json({ username })
}