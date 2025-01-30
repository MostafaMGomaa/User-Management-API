import { Request, NextFunction } from 'express';
import { HttpException } from '../http-response.util';

export const errorHandler = (
  err: Error,
  req: Request,
  res,
  next: NextFunction
) => {
  if (err instanceof HttpException) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details,
    });
  }

  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};
