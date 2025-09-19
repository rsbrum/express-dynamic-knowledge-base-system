import { ResourcesService } from '@/features/resources/resources.service';
import { ResourcesController } from '@/features/resources/resources.controller';
import { BaseApplicationRoute } from '@/lib/BaseApplicationRoute';
import Logger from '@/core/logger';
import { TopicVersionsRepository } from '@/features/topics/topic-version.repository';
import { ResourcesRepository } from '@/features/resources/resources.repository';

export class ResourcesRoutes extends BaseApplicationRoute {
  private resourcesService!: ResourcesService;
  private resourcesController!: ResourcesController;
  private resourcesRepository!: ResourcesRepository;
  private topicVersionsRepository!: TopicVersionsRepository;
  private logger = new Logger(ResourcesRoutes.name);

  protected registerRoutes() {
    this.router.get('/', (req, res) => this.resourcesController.getResources(req, res));
    this.router.post('/', (req, res) => this.resourcesController.createResource(req, res));
    this.router.put('/:id', (req, res) => this.resourcesController.updateResource(req, res));
    this.router.delete('/:id', (req, res) => this.resourcesController.deleteResource(req, res));
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
