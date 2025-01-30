import { Request, Response } from 'express';
import { AuthService } from '../services';
import { handleError, successResponse } from '../utils';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response) => {
    try {
      const user = await this.authService.register(req.body);

      successResponse(res, 201, {
        data: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (error) {
      handleError(res, error);
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const token = await this.authService.login(email, password);

      successResponse(res, 200, { data: { token } });
    } catch (error) {
      handleError(res, error);
    }
  };

  verifyUser = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const isVerified = await this.authService.verifyUser(email);

      successResponse(res, 200, {
        data: { isVerified },
      });
    } catch (error) {
      handleError(res, error);
    }
  };
}
