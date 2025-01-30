import { User } from '../../src/entities/User';

declare global {
  namespace Express {
    interface Request {
      user?: Pick<User, 'id' | 'isAdmin'>;
    }
  }
}

export {};
