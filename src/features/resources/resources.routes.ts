import { ResourcesService } from '@/features/resources/resources.service';
import { ResourcesController } from '@/features/resources/resources.controller';
import { BaseApplicationRoute } from '@/lib/BaseApplicationRoute';
import Logger from '@/core/logger';

export class ResourcesRoutes extends BaseApplicationRoute {
  private resourcesService!: ResourcesService;
  private resourcesController!: ResourcesController;
  private logger = new Logger(ResourcesRoutes.name);

  protected registerRoutes() {
    this.router.get('/', (req, res) => this.resourcesController.getResources(req, res));
    this.logger.log('Routes registered');
  }

  protected initializeDependencies() {
    this.resourcesService = new ResourcesService();
    this.resourcesController = new ResourcesController(this.resourcesService);
    this.logger.log('Dependencies initialized');
  }
}
