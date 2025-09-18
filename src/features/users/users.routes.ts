import { UsersController } from '@/features/users/users.controller';
import { UsersService } from '@/features/users/users.service';
import { BaseApplicationRoute } from '@/lib/BaseApplicationRoute';
import Logger from '@/core/logger';

export class UsersRoutes extends BaseApplicationRoute {
  private usersService!: UsersService;
  private usersController!: UsersController;
  private logger = new Logger(UsersRoutes.name);

  protected initializeDependencies(): void {
    this.usersService = new UsersService();
    this.usersController = new UsersController(this.usersService);
    this.logger.log('dependencies initialized');
  }

  protected registerRoutes(): void {
    this.router.get('/', (req, res) => this.usersController.getUsers(req, res));
    this.logger.log('routes registered');
  }
}
