import { TopicsService } from '@/features/topics/topics.service';
import { TopicsController } from '@/features/topics/topics.controller';
import { BaseApplicationRoute } from '@/lib/BaseApplicationRoute';
import Logger from '@/core/logger';

export class TopicsRoutes extends BaseApplicationRoute {
  private topicsService!: TopicsService;
  private topicsController!: TopicsController;
  private logger = new Logger(TopicsRoutes.name);

  protected initializeDependencies() {
    this.topicsService = new TopicsService();
    this.topicsController = new TopicsController(this.topicsService);
    this.logger.log('Dependencies initialized');
  }

  protected registerRoutes() {
    this.router.get('/', (req, res) => this.topicsController.getTopics(req, res));
    this.router.get('/:id', (req, res) => this.topicsController.getTopic(req, res));
    this.router.put('/:id', (req, res) => this.topicsController.updateTopic(req, res));
    this.router.post('/', (req, res) => this.topicsController.createTopic(req, res));
    this.router.delete('/:id', (req, res) => this.topicsController.deleteTopic(req, res));

    this.logger.log('Routes registered');
  }
}
