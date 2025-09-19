import { UsersController } from '@/features/users/users.controller';
import { UsersService } from '@/features/users/users.service';
import { BaseApplicationRoute } from '@/lib/BaseApplicationRoute';
import { AuthMiddleware } from '@/core/middlewares/auth.middleware';
import { PermissionsMiddleware } from '@/core/middlewares/permissions.middleware';
import { EUserPermissions } from '@/lib/EUserPermissions';
import Logger from '@/core/logger';

export class UsersRoutes extends BaseApplicationRoute {
  private usersService!: UsersService;
  private usersController!: UsersController;
  private logger = new Logger(UsersRoutes.name);

  protected initializeDependencies(): void {
    this.usersService = new UsersService();
    this.usersController = new UsersController(this.usersService);
    this.logger.log('Dependencies initialized');
  }

  protected registerRoutes(): void {
    this.router.use(AuthMiddleware.authenticate);
    this.router.use(PermissionsMiddleware.attachPermissions);

    this.router.get('/', (req, res) => this.usersController.getUsers(req, res));

    this.logger.log('Routes registered with permissions');
  }
}
