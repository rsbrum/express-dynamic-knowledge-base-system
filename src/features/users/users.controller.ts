import { UsersService } from '@/features/users/users.service';
import { DataResponse } from '@/lib/PayloadResponse';
import { ErrorResponse } from '@/lib/ErrorResponse';
import Logger from '@/core/logger';
import { Request, Response } from 'express';
import { UserUpdatePayloadSchema } from '@/lib/UserUpdatePayloadSchema';
import { UserCreatePayloadSchema } from '@/lib/UserCreatePayloadSchema';
import { EUserRole } from '@/lib/EUserRole';
import { z } from 'zod';

export class UsersController {
  logger = new Logger(UsersController.name);
  constructor(private usersService: UsersService) {}

  async getUsers(req: Request, res: Response) {
    try {
      const users = await this.usersService.getUsers();
      this.logger.log('Users fetched successfully');

      DataResponse.success(users, 'Users fetched successfully').send(res);
    } catch (error) {
      ErrorResponse.internal(
        'Failed to get users',
        error instanceof Error ? error.message : 'Unknown error',
      ).send(res);
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const id = req.params['id'];
      if (!id) {
        ErrorResponse.badRequest('Invalid request', 'User ID is required').send(res, 400);
        return;
      }
      const user = await this.usersService.deleteUser(+id);
      this.logger.log(`User deleted: ${id}`);
      DataResponse.success(user, 'User deleted successfully').send(res);
    } catch (error) {
      ErrorResponse.internal(
        'Failed to delete user',
        error instanceof Error ? error.message : 'Unknown error',
      ).send(res);
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const userPayload = UserCreatePayloadSchema.parse(req.body);
      const user = await this.usersService.createUser({
        name: userPayload.name,
        email: userPayload.email,
        role: userPayload.role as EUserRole,
      });
      this.logger.log(`User created: ${user.id}`);
      DataResponse.success(user, 'User created successfully').send(res);
    } catch (error) {
      if (error instanceof z.ZodError) {
        ErrorResponse.validation().send(res, 400);
        this.logger.error('Validation error', error.message);
      } else {
        this.logger.error(
          'Failed to create user',
          error instanceof Error ? error.message : 'Unknown error',
        );
        ErrorResponse.internal(
          'Failed to create user',
          error instanceof Error ? error.message : 'Unknown error',
        ).send(res);
      }
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const id = req.params['id'];
      if (!id) {
        ErrorResponse.badRequest('Invalid request', 'User ID is required').send(res, 400);
        return;
      }
      const userPayload = UserUpdatePayloadSchema.parse(req.body);
      const user = await this.usersService.updateUser(+id, {
        name: userPayload.name,
        email: userPayload.email,
        role: userPayload.role as EUserRole,
      });
      this.logger.log(`User updated: ${id}`);
      DataResponse.success(user, 'User updated successfully').send(res);
    } catch (error) {
      if (error instanceof z.ZodError) {
        ErrorResponse.validation().send(res, 400);
        this.logger.error('Validation error', error.message);
      } else {
        this.logger.error(
          'Failed to update user',
          error instanceof Error ? error.message : 'Unknown error',
        );
        ErrorResponse.internal(
          'Failed to update user',
          error instanceof Error ? error.message : 'Unknown error',
        ).send(res);
      }
    }
  }
}
