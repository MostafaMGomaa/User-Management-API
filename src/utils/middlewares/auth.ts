import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../http-response.util';
import { verifyToken, extractToken } from '../auth.util';
import { UserRepository } from '../../repositories';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req.headers.authorization);
    const payload = verifyToken(token);

    const userRepository = new UserRepository();
    const user = await userRepository.findById(payload.id);

    if (!user) {
      throw HttpException.unauthorized('Invalid user credentials');
    }

    req.user = {
      id: user.id,
      isAdmin: user.isAdmin,
    };
    next();
  } catch (error) {
    next(error);
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    return next(HttpException.forbidden('Unauthorized to perform this action'));
  }
  next();
};
