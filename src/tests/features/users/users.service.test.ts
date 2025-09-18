import { UsersService } from '@/features/users/users.service';
import { UserRepository } from '@/features/users/users.repository';
import { User } from '@/features/users/user.entity';
import { UserRole } from '@/lib/EUserRole';

jest.mock('@/features/users/users.repository');

describe('UsersService', () => {
  let usersService: UsersService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    jest.clearAllMocks();

    usersService = new UsersService();
    mockUserRepository = (usersService as any).userRepository;
  });

  describe('getUsers', () => {
    it('should return all users from the repository', async () => {
      const expectedUsers: User[] = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: UserRole.ADMIN,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: UserRole.VIEWER,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockUserRepository.findAllUsers.mockResolvedValue(expectedUsers);

      const result = await usersService.getUsers();

      expect(result).toEqual(expectedUsers);
      expect(mockUserRepository.findAllUsers).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no users exist', async () => {
      mockUserRepository.findAllUsers.mockResolvedValue([]);

      const result = await usersService.getUsers();

      expect(result).toEqual([]);
      expect(mockUserRepository.findAllUsers).toHaveBeenCalledTimes(1);
    });
  });
});
