import { Response } from 'express';

export class HttpException extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
    public readonly details?: any
  ) {
    super(message);
  }

  static badRequest(message: string = 'Bad request', details?: any) {
    return new HttpException(400, message, details);
  }

  static unauthorized(message: string = 'Unauthorized') {
    return new HttpException(401, message);
  }

  static forbidden(message: string = 'Forbidden') {
    return new HttpException(403, message);
  }

  static notFound(message: string = 'Resource not found') {
    return new HttpException(404, message);
  }

  static conflict(message: string = 'Conflict occurred') {
    return new HttpException(409, message);
  }

  static internal(message: string = 'Internal server error') {
    return new HttpException(500, message);
  }
}

export function handleError(res: Response, error: unknown) {
  if (error instanceof HttpException) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      details: error.details,
    });
  }

  console.error(error);
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
}

export function successResponse(
  res: Response,
  code: number = 200,
  options: { message?: string; data?: any }
) {
  return res.status(code).json({
    success: true,
    message: options.message,
    data: options.data,
  });
}
