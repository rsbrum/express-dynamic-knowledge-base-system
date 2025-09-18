import { ResourcesService } from '@/features/resources/resources.service';
import { ResourcesController } from '@/features/resources/resources.controller';
import { BaseApplicationRoute } from '@/lib/BaseApplicationRoute';

export class ResourcesRoutes extends BaseApplicationRoute {
  private resourcesService!: ResourcesService;
  private resourcesController!: ResourcesController;

  protected registerRoutes() {
    this.router.get('/', (req, res) => this.resourcesController.getResources(req, res));
  }

  protected initializeDependencies() {
    this.resourcesService = new ResourcesService();
    this.resourcesController = new ResourcesController(this.resourcesService);
  }
}
