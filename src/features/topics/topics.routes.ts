import { TopicsService } from '@/features/topics/topics.service';
import { TopicsController } from '@/features/topics/topics.controller';
import { BaseApplicationRoute } from '@/lib/BaseApplicationRoute';

export class TopicsRoutes extends BaseApplicationRoute {
  private topicsService!: TopicsService;
  private topicsController!: TopicsController;

  protected initializeDependencies() {
    this.topicsService = new TopicsService();
    this.topicsController = new TopicsController(this.topicsService);
  }

  protected registerRoutes() {
    this.router.get('/', (req, res) => this.topicsController.getTopics(req, res));
  }
}
