import { UsersController } from '@/features/users/users.controller';
import { UsersService } from '@/features/users/users.service';
import { BaseApplicationRoute } from '@/lib/BaseApplicationRoute';
import { AuthMiddleware } from '@/core/middlewares/auth.middleware';
import { PermissionsMiddleware } from '@/core/middlewares/permissions.middleware';
import { EUserPermissions } from '@/lib/EUserPermissions';
import Logger from '@/core/logger';
import { UserRepository } from './users.repository';

export class UsersRoutes extends BaseApplicationRoute {
  private usersService!: UsersService;
  private usersController!: UsersController;
  private userRepository!: UserRepository;
  private logger = new Logger(UsersRoutes.name);

  protected initializeDependencies(): void {
    this.userRepository = new UserRepository();
    this.usersService = new UsersService(this.userRepository);
    this.usersController = new UsersController(this.usersService);
    this.logger.log('Dependencies initialized');
  }

  protected registerRoutes(): void {
    this.router.use(AuthMiddleware.authenticate);
    this.router.use(PermissionsMiddleware.attachPermissions);

    this.router.get(
      '/',
      PermissionsMiddleware.requirePermission(EUserPermissions.CAN_MANAGE_USERS),
      (req, res) => this.usersController.getUsers(req, res),
    );
    this.router.post(
      '/',
      PermissionsMiddleware.requirePermission(EUserPermissions.CAN_MANAGE_USERS),
      (req, res) => this.usersController.createUser(req, res),
    );
    this.router.put(
      '/:id',
      PermissionsMiddleware.requirePermission(EUserPermissions.CAN_MANAGE_USERS),
      (req, res) => this.usersController.updateUser(req, res),
    );
    this.router.delete(
      '/:id',
      PermissionsMiddleware.requirePermission(EUserPermissions.CAN_MANAGE_USERS),
      (req, res) => this.usersController.deleteUser(req, res),
    );
    this.logger.log('Routes registered with permissions');
  }
}
