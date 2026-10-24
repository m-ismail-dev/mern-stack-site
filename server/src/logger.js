import winston from 'winston';
import env from './config/env.js';


const { combine, timestamp, errors, json, colorize, printf, metadata } = winston.format;
const isProd = env.NODE_ENV === 'production';
const only = level => winston.format(info => info.level === level ? info : false)();

const consoleFormat = combine(
  timestamp({ format: 'HH:mm:ss' }),
  colorize(),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack, ...meta }) => {
    const extra = Object.keys(meta).length ? `\nmeta: ${JSON.stringify(meta)}` : '';
    return `${timestamp} ${level}: ${stack || message}${extra}`;
})
);
const fileFormat = combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), json());

export default winston.createLogger({
  level: isProd ? 'info' : 'debug',
  format: fileFormat,
  transports: [
    new winston.transports.File({ filename: 'log/debug.log' }),
    new winston.transports.File({ filename: 'log/access.log', level: 'http', format: only('http') }),
    new winston.transports.File({ filename: 'log/error.log', level: 'error', format: only('error') }),
    new winston.transports.Console(isProd ? undefined : { level: 'info', format: consoleFormat })
  ]
});
