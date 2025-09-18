import { UsersController } from '@/features/users/users.controller';
import { UsersService } from '@/features/users/users.service';
import { BaseApplicationRoute } from '@/lib/BaseApplicationRoute';

export class UsersRoutes extends BaseApplicationRoute {
  private usersService!: UsersService;
  private usersController!: UsersController;

  protected initializeDependencies(): void {
    this.usersService = new UsersService();
    this.usersController = new UsersController(this.usersService);
  }

  protected registerRoutes(): void {
    this.router.get('/', (req, res) => this.usersController.getUsers(req, res));
  }
}
