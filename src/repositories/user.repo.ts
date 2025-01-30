import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { IUserRepository } from './IUser.repo';
import { FindManyOptions, Between, Like, LessThan } from 'typeorm';

export class UserRepository implements IUserRepository {
  private userRepo = AppDataSource.getRepository(User);

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.userRepo.create(user);

    return await this.userRepo.save(newUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findOneBy({ email });
  }

  async findById(id: number): Promise<Partial<User> | null> {
    return await this.userRepo.findOne({
      where: { id },
      select: [
        'id',
        'loginCount',
        'name',
        'email',
        'lastLogin',
        'createdAt',
        'isVerified',
        'isAdmin',
      ],
    });
  }

  async update(
    id: number,
    updates: Partial<User>
  ): Promise<Partial<User> | null> {
    await this.userRepo.update(id, updates);
    const updatedUser = await this.findById(id);

    if (!updatedUser) return null;

    return updatedUser;
  }

  async delete(id: number): Promise<void> {
    await this.userRepo.delete(id);
  }

  async findAll(
    options: FindManyOptions<User> = {}
  ): Promise<{ users: User[]; count: number }> {
    const [users, count] = await this.userRepo.findAndCount({
      ...options,
      select: [
        'id',
        'loginCount',
        'name',
        'email',
        'lastLogin',
        'createdAt',
        'isVerified',
        'isAdmin',
      ],
    });

    return { users, count };
  }

  async countUsers(): Promise<number> {
    return await this.userRepo.count();
  }

  async countVerifiedUsers(): Promise<number> {
    return await this.userRepo.count({ where: { isVerified: true } });
  }

  async findTopUsers(): Promise<User[]> {
    const options: FindManyOptions<User> = {
      order: { loginCount: 'DESC' },
      take: 3,
    };
    const { users } = await this.findAll(options);

    return users;
  }

  /**
   * Find inactive users (those who haven't logged in for the past hour or month)
   * @param oneHourAgo Date object for the time one hour ago
   * @param oneMonthAgo Date object for the time one month ago
   * @async
   */
  async findInactiveUsers(
    oneHourAgo: Date,
    oneMonthAgo: Date
  ): Promise<User[]> {
    const options: FindManyOptions<User> = {
      where: [
        { lastLogin: LessThan(oneHourAgo) },
        { lastLogin: LessThan(oneMonthAgo) },
      ],
    };
    const { users } = await this.findAll(options);

    return users;
  }
}
