import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/userRepositories';
import { AuthInputDto, AuthPayloadDto, AuthSchema } from '../dto/authDto';
import { AppError } from '../error/errorHandlers';
import { JWT_SECRET } from '../config';

export class AuthService {
  private userRepository = new UserRepository();

  async register(input: AuthInputDto): Promise<AuthPayloadDto> {
    const validation = AuthSchema.safeParse(input);
    if (!validation.success) {
      throw new AppError(validation.error.issues[0].message, 'VALIDATION_ERROR');
    }

    const { email, passwordPlain } = validation.data;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(passwordPlain, 10); // 10 is the salt rounds, which determines how secure the hash will be. Higher is more secure but also slower.
    const userDoc = await this.userRepository.create(email, hashedPassword);
    
    const token = this.generateToken(userDoc.id);

    return {
      token,
      user: { id: userDoc.id.toString(), email: userDoc.email }
    };
  }

  async login(input: AuthInputDto): Promise<AuthPayloadDto> {
    const validation = AuthSchema.safeParse(input);
    if (!validation.success) {
      throw new AppError(validation.error.issues[0].message, 'VALIDATION_ERROR');
    }

    const { email, passwordPlain } = validation.data;

    const userDoc = await this.userRepository.findByEmail(email);
    if (!userDoc) {
      throw new AppError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(passwordPlain, userDoc.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password');
    }

    const token = this.generateToken(userDoc.id);

    return {
      token,
      user: { id: userDoc.id.toString(), email: userDoc.email }
    };
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });
  }
}