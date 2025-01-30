import { IUserRepository } from '../repositories';
import { User } from '../entities/User';
import { HttpException } from '../utils/http-response.util';
import { Like } from 'typeorm';

type UserFilters = {
  email?: string;
  name?: string;
  isVerified?: string;
};
export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  getAllUsers = async (
    filter: UserFilters,
    page: number = 1,
    limit: number = 10
  ) => {
    const options = {
      where: this.buildWhereClause(filter),
      skip: (page - 1) * limit,
      take: limit,
    };
    const { count, users } = await this.userRepository.findAll(options);
    const totalVerifiedUsers = await this.userRepository.countVerifiedUsers();
    const totalRegisteredUsers = await this.userRepository.countUsers();

    return { users, totalRegisteredUsers, count, totalVerifiedUsers };
  };

  private buildWhereClause(filter: UserFilters) {
    const where: any = {};
    if (filter.name) where.name = Like(`%${filter.name}%`);
    if (filter.email) where.email = Like(`%${filter.email}%`);
    if (filter.isVerified !== undefined) where.isVerified = filter.isVerified;

    return where;
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) throw HttpException.notFound('User not found');

    return user;
  }

  async updateUser(id: number, updates: Partial<User>) {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) throw HttpException.notFound('User not found');

    if (updates.email) {
      const userWithEmail = await this.userRepository.findByEmail(
        updates.email
      );
      if (userWithEmail && userWithEmail.id !== id) {
        throw HttpException.conflict('Email already in use');
      }
    }

    return this.userRepository.update(id, updates);
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) throw HttpException.notFound('User not found');
    await this.userRepository.delete(id);
  }
  getTopUsers = async () => {
    return this.userRepository.findTopUsers();
  };

  getInactiveUsers = async () => {
    const oneHourAgo = new Date(Date.now() - 3600 * 1000);
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 3600 * 1000);

    return this.userRepository.findInactiveUsers(oneHourAgo, oneMonthAgo);
  };
}
