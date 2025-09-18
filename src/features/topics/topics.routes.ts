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
    this.logger.log('dependencies initialized');
  }

  protected registerRoutes() {
    this.router.get('/', (req, res) => this.topicsController.getTopics(req, res));
    this.logger.log('routes registered');
  }
}
