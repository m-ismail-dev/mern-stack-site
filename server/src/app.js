import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import apiRouter from './routes/index.js';
import prisma from './lib/prisma.js';
import env from './config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../client/dist');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10kb'}));
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(cookieParser());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
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

app.use((err, req, res, next) => {
  console.error('\x1b[31mUnhandled server error\x1b[0m:', err);

  if (err?.statusCode) {
    return res.status(err.statusCode).json({ message: err.message || 'Request failed' });
  }

  if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }

  return res.status(500).json({ message: 'Internal server error' });
});

export default app;
