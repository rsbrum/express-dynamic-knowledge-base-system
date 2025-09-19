import { ResourcesService } from '@/features/resources/resources.service';
import { ResourcesController } from '@/features/resources/resources.controller';
import { BaseApplicationRoute } from '@/lib/BaseApplicationRoute';
import Logger from '@/core/logger';
import { TopicVersionsRepository } from '@/features/topics/topic-versions/topic-version.repository';
import { ResourcesRepository } from '@/features/resources/resources.repository';
import { AuthMiddleware } from '@/core/middlewares/auth.middleware';
import { PermissionsMiddleware } from '@/core/middlewares/permissions.middleware';
import { EUserPermissions } from '@/lib/EUserPermissions';

export class ResourcesRoutes extends BaseApplicationRoute {
  private resourcesService!: ResourcesService;
  private resourcesController!: ResourcesController;
  private resourcesRepository!: ResourcesRepository;
  private topicVersionsRepository!: TopicVersionsRepository;
  private logger = new Logger(ResourcesRoutes.name);

  protected registerRoutes() {
    this.router.use(AuthMiddleware.authenticate);
    this.router.use(PermissionsMiddleware.attachPermissions);

    this.router.get(
      '/',
      PermissionsMiddleware.requirePermission(EUserPermissions.CAN_VIEW),
      (req, res) => this.resourcesController.getResources(req, res),
    );
    this.router.post(
      '/',
      PermissionsMiddleware.requirePermission(EUserPermissions.CAN_EDIT),
      (req, res) => this.resourcesController.createResource(req, res),
    );
    this.router.put(
      '/:id',
      PermissionsMiddleware.requirePermission(EUserPermissions.CAN_EDIT),
      (req, res) => this.resourcesController.updateResource(req, res),
    );
    this.router.delete(
      '/:id',
      PermissionsMiddleware.requirePermission(EUserPermissions.CAN_DELETE),
      (req, res) => this.resourcesController.deleteResource(req, res),
    );
    this.logger.log('Routes registered');
  }

  protected initializeDependencies() {
    this.resourcesRepository = new ResourcesRepository();
    this.topicVersionsRepository = new TopicVersionsRepository();
    this.resourcesService = new ResourcesService(
      this.resourcesRepository,
      this.topicVersionsRepository,
    );
    this.resourcesController = new ResourcesController(this.resourcesService);
    this.logger.log('Dependencies initialized');
  }
}
