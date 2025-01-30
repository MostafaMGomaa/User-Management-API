import { User } from '../entities/User';
import { FindManyOptions } from 'typeorm';

export interface IUserRepository {
  create(user: Partial<User>): Promise<User>;
  findById(id: number): Promise<Partial<User> | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: number, updates: Partial<User>): Promise<Partial<User> | null>;
  delete(id: number): Promise<void>;
  findAll(
    options?: FindManyOptions<User>
  ): Promise<{ users: User[]; count: number }>;
  countUsers(): Promise<number>;
  countVerifiedUsers(): Promise<number>;
  findInactiveUsers(oneHourAgo: Date, oneMonthAgo: Date): Promise<User[]>;
  findTopUsers(): Promise<User[]>;
}
