import { Request, Response } from 'express';
import { UsersController } from '@/features/users/users.controller';
import { UsersService } from '@/features/users/users.service';
import { User } from '@/features/users/user.entity';
import { UserRole } from '@/lib/EUserRole';

jest.mock('@/features/users/users.service');

describe('UsersController', () => {
  let usersController: UsersController;
  let mockUsersService: jest.Mocked<UsersService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockUsersService = new UsersService() as jest.Mocked<UsersService>;
    usersController = new UsersController(mockUsersService);

    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe('getUsers', () => {
    it('should return users with success message', async () => {
      const expectedUsers: User[] = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: UserRole.ADMIN,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockUsersService.getUsers.mockResolvedValue(expectedUsers);

      await usersController.getUsers(mockRequest as Request, mockResponse as Response);

      expect(mockUsersService.getUsers).toHaveBeenCalledTimes(1);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: expectedUsers,
      });
    });

    it('should handle empty user list', async () => {
      mockUsersService.getUsers.mockResolvedValue([]);

      await usersController.getUsers(mockRequest as Request, mockResponse as Response);

      expect(mockUsersService.getUsers).toHaveBeenCalledTimes(1);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: [],
      });
    });
  });
});
