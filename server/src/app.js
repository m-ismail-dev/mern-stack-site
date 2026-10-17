import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import apiRouter from './routes/index.js';
import prisma from './lib/prisma.js';
import env from './config/env.js';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10kb'}));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(cookieParser());

app.get('/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api', apiRouter);
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((error, req, res, next) => {
  console.error('\x1b[31mUnhandled server error\x1b[0m:', error);

  if (error?.statusCode) {
    return res.status(error.statusCode).json({ message: error.message || 'Request failed' });
  }

  if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }

  return res.status(500).json({ message: 'Internal server error' });
});

export default app;
