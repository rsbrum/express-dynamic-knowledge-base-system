import { TopicsService } from '@/features/topics/topics.service';
import { TopicsController } from '@/features/topics/topics.controller';
import { BaseApplicationRoute } from '@/lib/BaseApplicationRoute';
import Logger from '@/core/logger';
import { PermissionsMiddleware } from '@/core/middlewares/permissions.middleware';
import { AuthMiddleware } from '@/core/middlewares/auth.middleware';
import { EUserPermissions } from '@/lib/EUserPermissions';
import { TopicsRepository } from '@/features/topics/topics.repository';
import { ResourcesRepository } from '@/features/resources/resources.repository';
import { TopicVersionsRepository } from '@/features/topics/topic-versions/topic-version.repository';
import { TopicVersionService } from '@/features/topics/topic-versions/topic-version.service';

export class TopicsRoutes extends BaseApplicationRoute {
  private topicsService!: TopicsService;
  private topicsController!: TopicsController;
  private logger = new Logger(TopicsRoutes.name);
  private topicsRepository!: TopicsRepository;
  private topicVersionsRepository!: TopicVersionsRepository;
  private resourcesRepository!: ResourcesRepository;
  private topicVersionService!: TopicVersionService;

  protected initializeDependencies() {
    this.topicsRepository = new TopicsRepository();
    this.topicVersionsRepository = new TopicVersionsRepository();
    this.resourcesRepository = new ResourcesRepository();
    this.topicVersionService = new TopicVersionService(this.topicVersionsRepository);
    this.topicsService = new TopicsService(
      this.topicsRepository,
      this.topicVersionService,
      this.resourcesRepository,
    );
    this.topicsController = new TopicsController(this.topicsService);
    this.logger.log('Dependencies initialized');
  }

  protected registerRoutes() {
    this.router.use(AuthMiddleware.authenticate);
    this.router.use(PermissionsMiddleware.attachPermissions);

    this.router.get(
      '/',
      PermissionsMiddleware.requirePermission(EUserPermissions.CAN_VIEW),
      (req, res) => this.topicsController.getTopics(req, res),
    );
    this.router.get(
      '/:id',
      PermissionsMiddleware.requirePermission(EUserPermissions.CAN_VIEW),
      (req, res) => this.topicsController.getTopic(req, res),
    );
    this.router.get(
      '/:id/version/:version',
      PermissionsMiddleware.requirePermission(EUserPermissions.CAN_VIEW),
      (req, res) => this.topicsController.getTopicByVersion(req, res),
    );
    this.router.put(
      '/:id',
      PermissionsMiddleware.requirePermission(EUserPermissions.CAN_EDIT),
      (req, res) => this.topicsController.updateTopic(req, res),
    );
    this.router.post(
      '/',
      PermissionsMiddleware.requirePermission(EUserPermissions.CAN_EDIT),
      (req, res) => this.topicsController.createTopic(req, res),
    );
    this.router.delete(
      '/:id',
      PermissionsMiddleware.requirePermission(EUserPermissions.CAN_DELETE),
      (req, res) => this.topicsController.deleteTopic(req, res),
    );

    this.logger.log('Routes registered');
  }
}
