import { UsersService } from '@/features/users/users.service';
import { Request, Response } from 'express';

export class UsersController {
  constructor(private usersService: UsersService) {}

  async getUsers(_req: Request, res: Response) {
    res.json({ message: this.usersService.getUsers() });
  }
}
