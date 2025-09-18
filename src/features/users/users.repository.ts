import { BaseRepository } from "@/lib/BaseRepository";
import { User } from "@/features/users/user.entity";

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }

	async findAllUsers(): Promise<User[]> {
		return await this.repository.find();
	}
}
