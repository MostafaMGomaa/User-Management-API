import jwt from 'jsonwebtoken';
import { HttpException } from './http-response.util';
import { User } from '../entities/User';

interface TokenPayload {
  id: number;
  isAdmin: boolean;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(
    { id: payload.id, isAdmin: payload.isAdmin },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
}

export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  } catch (error) {
    throw HttpException.unauthorized('Invalid or expired token');
  }
}

export function extractToken(authHeader: string | undefined): string {
  if (!authHeader) {
    throw HttpException.unauthorized('Unauthenticated');
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    throw HttpException.unauthorized('Unauthenticated');
  }

  return token;
}
