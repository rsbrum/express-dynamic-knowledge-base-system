import { UserRepository } from '@/features/users/users.repository';
import { User } from '@/features/users/user.entity';

export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async getUsers() {
    return await this.userRepository.findAllUsers();
  }

  async deleteUser(id: number) {
    return await this.userRepository.delete(id);
  }

  async updateUser(id: number, userPayload: Partial<User>) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      return null;
    }

    const updatedUser = await this.userRepository.update(id, userPayload);
    return updatedUser;
  }

  async createUser(userPayload: Partial<User>) {
    const newUser = await this.userRepository.createUser(userPayload);
    return newUser;
  }
}
