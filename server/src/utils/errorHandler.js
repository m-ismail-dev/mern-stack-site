import jwt from 'jsonwebtoken';
import logger from '../logger.js';
import { Prisma } from '../generated/prisma/client.ts';
import AppError from './AppError.js';

export default function errorHandler(err, req, res, next) {
    const [status, message] = (() => {
        if (err instanceof AppError) return [err.status, err.message];
        else if (err instanceof jwt.JsonWebTokenError) return [401, 'Token invalid'];
        else if (err instanceof jwt.TokenExpiredError) return [401, 'Token expired']
        else if (err instanceof Prisma.PrismaClientKnownRequestError) {
            switch (err.code) {
                case 'P2002': return [409, 'Already exists'];
                case 'P2025': return [404, 'Record not found'];
                case 'P2003': return [409, 'Related record does not exist or is still in use'];
                case 'P2000': return [400, 'A value is too long'];
                case 'P2024': return [503, 'Service busy, try again'];
                default: return [500, 'Internal server error'];
            }
        } else return [500, 'Internal server error']
    })();

    if (status >= 500) logger.error({
        ip: req.ip,
        method: req.method,
        url: req.originalUrl,
        status,
        message: err.message,
        stack: err?.stack
    });

    return res.status(status).json({ message });
}
