// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export default function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) return next(err);

  const status = err.status >= 400 && err.status < 600 ? err.status : 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? err.message || 'Internal Server Error'
      : `${err.message}\n${err.stack}`;

  console.error(`[Error] ${status} - ${err.message}`, {
    path: req.path,
    method: req.method,
    stack: err.stack,
  });

  res.status(status).json({
    error: {
      message,
      status,
      code: err.code || undefined,
    },
  });
}
