import { UserModel, IUser } from '../models/userModel';

export class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email: email.toLowerCase() });
  }

  async create(email: string, passwordHash: string): Promise<IUser> {
    return await UserModel.create({
      email,
      passwordHash,
    });
  }
}