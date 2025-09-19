import { BaseRepository } from '@/lib/BaseRepository';
import { User } from '@/features/users/user.entity';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }

  async createUser(user: Partial<User>): Promise<User> {
    const newUser = this.repository.create(user);
    return await this.repository.save(newUser);
  }

  async findById(id: number): Promise<User | null> {
    return await this.repository.findOneBy({ id });
  }

  async findAllUsers(): Promise<User[]> {
    return await this.repository.find();
  }

  async delete(id: number) {
    const resource = await this.repository.findOneBy({ id });

    if (!resource) {
      console.warn(`User not found for id: ${id}`);
      return;
    }

    return await this.repository.remove(resource);
  }

  async update(id: number, user: Partial<User>): Promise<User | null> {
    await this.repository.update(id, user);
    return await this.repository.findOneBy({ id });
  }
}
