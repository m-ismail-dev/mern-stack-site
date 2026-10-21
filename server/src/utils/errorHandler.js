import jwt from 'jsonwebtoken';
import logger from '../logger.js';
import { Prisma } from '../generated/prisma/client.ts';

export default function errorHandler(err, req, res, next) {
    let { status, message = 'Internal server error' } = err;
    
    if (!status) {
        if (err instanceof jwt.JsonWebTokenError) {
            status = 401;
            message = 'Token invalid';
        } else if (err instanceof jwt.TokenExpiredError) {
            status = 401;
            message = 'Token expired';
        } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
            switch (err.code) {
                case 'P2002': { // unique constraint
                    status = 409;
                    message = 'Already exists';
                    break;
                }

                case 'P2025': { // record not found 
                    status = 404;
                    message = 'Record not found';
                    break;
                }
                case 'P2003': { // foreign key failed
                    status = 409;
                    message = 'Related record does not exist or is still in use';
                    break;
                }
                case 'P2000': { // value too long
                    status = 400;
                    message = 'A value is too long';
                    break;
                }
                case 'P2024': { // connection pool timeout
                    status = 503;
                    message = 'Service busy, try again';
                    break;
                }
                default: {
                    status = 500;
                    message = 'Internal server error';
                }
            }
        } else {
            status = 500;
        }

    }

    if (status >= 500) logger.error({
        ip: req.ip,
        method: req.method,
        url: req.originalUrl,
        status: err?.status ?? 500,
        message: err?.message || 'Unhandled error',
        stack: err?.stack
    });

    return res.status(status).json({ message });
}
