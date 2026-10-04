import jwt from 'jsonwebtoken';
import User from '../models/User.js';


const cookieBase = { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' }

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

    // set JWT cookies
    const accessToken = jwt.sign(
        { sub: user.id },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRY }
    );
    const refreshToken = jwt.sign(
        { sub: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env['JWT_REFRESH_EXPIRY' + rememberMe ? '_REMEMBER' : ''] }
    );

    res.cookie(
        'access_token',
        accessToken,
        cookieBase
    );
    res.cookie(
        'refresh_token',
        refreshToken,
        { ...cookieBase, maxAge: 30 * 24 * 60 * 60 * 1000, path: '/api/auth' }
    );

    res.json({ username });
}

export const refresh = async (req, res) => {
    const token = req.cookies.refresh_token;
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    try {
        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        res.cookie(
            'access_token',
            jwt.sign(
                payload,
                process.env.JWT_ACCESS_SECRET,
                { expiresIn: process.env.JWT_ACCESS_EXPIRY }
            ),
            cookieBase
        );
        res.json({ ok: true })
    } catch {
        res.status(401).json({ message: 'Token invalid or expired' })
    }
}


export const logout = async (req, res) => {
    res.clearCookie('access_token', cookieBase);
    res.clearCookie('refresh_token', { ...cookieBase, path: 'api/auth' })
    res.sendStatus(204);
}

export const me = async (req, res) => {
    const user = User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ username: user.username });
}
