import { UsersService } from '@/features/users/users.service';
import { Request, Response } from 'express';
import { DataResponse } from '@/lib/PayloadResponse';
import { EUserPermissions } from '@/lib/EUserPermissions';

export class UsersController {
  constructor(private usersService: UsersService) {}

  async getUsers(req: Request, res: Response) {

    const users = this.usersService.getUsers();

    DataResponse.success(users, 'Users fetched successfully').send(res);
  }
}
