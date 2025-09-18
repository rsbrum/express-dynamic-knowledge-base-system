import { UserRepository } from '@/features/users/users.repository';

export class UsersService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  getUsers() {
    return this.userRepository.findAllUsers();
  }

}
