import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRouter from '../routes/index.js'
import connectDB from '../config/db.js';

const app = experss();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api', apiRouter);

await connectDB();
app.listen(process.env.PORT);
