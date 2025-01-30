import bcrypt from 'bcrypt';
import { IUserRepository } from '../repositories/IUser.repo';
import { User } from '../entities/User';
import { HttpException } from '../utils/http-response.util';
import { generateToken } from '../utils/auth.util';

export class AuthService {
  constructor(private readonly userRepository: IUserRepository) {}

  async register(userData: Partial<User>) {
    const existingUser = await this.userRepository.findByEmail(userData.email!);
    if (existingUser) throw HttpException.conflict('Email already registered');

    const hashedPassword = await bcrypt.hash(userData.password!, 10);

    return this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw HttpException.unauthorized('Invalid credentials');
    }

    if (!user.isVerified) throw HttpException.forbidden('Account not verified');

    const updatedUser = await this.userRepository.update(user.id, {
      loginCount: user.loginCount + 1,
      lastLogin: new Date(),
    });

    return generateToken({ id: updatedUser.id, isAdmin: updatedUser.isAdmin });
  }

  async verifyUser(email: string): Promise<boolean> {
    return (await this.userRepository.findByEmail(email)).isVerified;
  }
}
