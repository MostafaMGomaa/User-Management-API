import { Request, Response } from 'express';
import { UserService } from '../services';
import { handleError, successResponse } from '../utils';

export class UserController {
  constructor(private readonly userService: UserService) {}

  getAllUsers = async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 10, ...filter } = req.query;
      const result = await this.userService.getAllUsers(
        filter,
        Number(page),
        Number(limit)
      );

      successResponse(res, 200, {
        data: {
          users: result.users,
          metaData: {
            totalVerifiedUsers: result.totalVerifiedUsers,
            totalRegisteredUsers: result.totalRegisteredUsers,
            count: result.count,
            page: Number(page),
            limit: Number(limit),
          },
        },
      });
    } catch (error) {
      handleError(res, error);
    }
  };

  getUserById = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.getUserById(Number(req.params.id));

      successResponse(res, 200, { data: { user } });
    } catch (error) {
      handleError(res, error);
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const updatedUser = await this.userService.updateUser(
        Number(req.params.id),
        req.body
      );

      successResponse(res, 200, { data: { user: updatedUser } });
    } catch (error) {
      handleError(res, error);
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      await this.userService.deleteUser(Number(req.params.id));

      successResponse(res, 204, {
        message: 'User deleted successfully',
      });
    } catch (error) {
      handleError(res, error);
    }
  };

  /**
   * Get the top 3 active users based on login count.
   */
  getTopUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.userService.getTopUsers();

      successResponse(res, 200, { data: { users } });
    } catch (error) {
      handleError(res, error);
    }
  };

  /**
   * Get users who haven't logged in within the last hour or month.
   */
  getInactiveUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.userService.getInactiveUsers();

      successResponse(res, 200, { data: { users } });
    } catch (error) {
      handleError(res, error);
    }
  };
}
