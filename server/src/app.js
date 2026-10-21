import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import morgan from 'morgan';
import apiRouter from './routes/index.js';
import prisma from './lib/prisma.js';
import env from './config/env.js';
import logger from './logger.js';
import errorHandler from './utils/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../client/dist');

const app = express();

app.use(morgan('combined', { stream: { write: msg => logger.http(msg.trim()) } }));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10kb' }));
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(cookieParser());

app.use('/api', apiRouter);
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('/{*any}', (req, res) => {
    return res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.use(errorHandler);

export default app;
