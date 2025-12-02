import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { json, urlencoded } from 'express';
import path from 'path';

import logger from './utils/logger';
import pinoHttpMiddleware from './middleware/pinoHttpMiddleware';
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware';

import authRouter from './routes/auth';
import userRouter from './routes/UserRouter';
import soldiersRoutes from './routes/soldier.route';
import tefillinRoutes from './routes/tefillinRoutes';
import messageRoutes from './routes/message.route';
import i18nRouter from './routes/i18nRouter';
import mediaRouter from './routes/mediaRouter';
import locationRoutes from './routes/locationRoutes';

const app = express();

// Middleware לניתוח JSON, אבטחה, לוגים, קבלת URLencoded וכו'
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(pinoHttpMiddleware);
app.use(cors({
  origin: process.env.CLIENT_URL?.split(','),
  credentials: true,
}));

// נקודת בדיקת בריאות פשוטה
app.get('/api/health', (req: Request, res: Response) => {
  req.log.info('Health check endpoint hit');
  logger.info('Health check endpoint hit');
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Middleware פשוט ללוג בקשות
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Request arrived at: ${req.method} ${req.url}`);
  next();
});


app.use('/api/locations', locationRoutes)
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/soldiers', soldiersRoutes);
app.use('/api/tefilin', tefillinRoutes);
app.use('/api/tefilin/report', tefillinRoutes);
app.use('/api/soldiers/report', soldiersRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/i18n', i18nRouter);

app.use('/api/media', mediaRouter);
app.use('/api/locations', locationRoutes);

app.use('/api/media', mediaRouter);

app.use('/api/messages', messageRoutes);

app.use(errorHandlerMiddleware);

export default app;
