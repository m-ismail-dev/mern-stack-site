import jwt from 'jsonwebtoken';
import User from './models/User.js';

const cookieBase = { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' }

const singAccess = id => jwt.sign(
    { sub: id },
    process.env.JWT_ACCESS_TOKEN,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY }
)

const signRefresh = (id, remember) => jwt.sign(
    { sub: id },
    process.env.JWT_REFRESH_TOKEN,
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