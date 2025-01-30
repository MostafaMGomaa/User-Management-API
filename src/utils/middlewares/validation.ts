import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { HttpException } from '../http-response.util';

export const inputValidate = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const output = plainToInstance(dtoClass, req.body, {});

    const errors = await validate(output, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const message = errors
        .map((error) => Object.values(error.constraints || {}))
        .join(', ');
      return next(HttpException.badRequest(message));
    }

    req.body = output;
    next();
  };
};
