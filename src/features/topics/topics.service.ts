import { Topic } from '@/features/topics/topic.entity';
import { TopicsRepository } from '@/features/topics/topics.repository';
import Logger from '@/core/logger';
import { TopicVersion } from '@/features/topics/topic-version.entity';
import { TopicVersionsRepository } from '@/features/topics/topic-version.repository';
import { TopicComposite } from '@/features/topics/topic-version.composite';
import { TopicComponent } from '@/features/topics/topic-version.component';
import { TopicVersionFactory } from '@/features/topics/topic-version.factory';
import { IHierarchicalTopicVersion } from '@/lib/IHierarchicalTopicVersion';
import { ResourcesRepository } from '@/features/resources/resources.repository';

// todo
// create topicsversion service and move all
// topicversion related files to a specific folder
export class TopicsService {
  private topicsRepository: TopicsRepository;
  private topicVersionsRepository: TopicVersionsRepository;
  private resourcesRepository: ResourcesRepository;

  private logger = new Logger(TopicsService.name);

  // todo
  // dependencies should be injected
  constructor() {
    this.topicsRepository = new TopicsRepository();
    this.topicVersionsRepository = new TopicVersionsRepository();
    this.resourcesRepository = new ResourcesRepository();
  }

  async createTopic(topic: Partial<TopicVersion>): Promise<TopicVersion> {
    const newTopic = await this.topicsRepository.createTopic();

    const newTopicVersion = await this.topicVersionsRepository.createTopicVersion({
      ...topic,
      topicId: newTopic.id,
      version: 1,
    });

    return newTopicVersion;
  }

  async getTopics(): Promise<IHierarchicalTopicVersion[]> {
    const topics: Topic[] = await this.topicsRepository.findAllTopics();
    const topicVersions: TopicVersion[] = [];

    for (let topic of topics) {
      const topicVersion = await this.topicVersionsRepository.findLatestVersion(topic.id);

      if (!topicVersion) {
        this.logger.warn(`No topic version found for topic ${topic.id}`);
        continue;
      }

      topicVersions.push(topicVersion);
    }

    const topicComponents: Map<number, TopicComponent> = new Map();
    const rootComponents: TopicComponent[] = [];

    for (const topicVersion of topicVersions) {
      const component = new TopicComposite(topicVersion);
      topicComponents.set(topicVersion.topicId, component);

      if (topicVersion.parentTopicId === null) {
        rootComponents.push(component);
      }
    }

    for (const topicVersion of topicVersions) {
      if (topicVersion.parentTopicId !== null) {
        const parentComponent = topicComponents.get(topicVersion.parentTopicId);
        const childComponent = topicComponents.get(topicVersion.topicId);

        if (parentComponent && childComponent && parentComponent.isComposite()) {
          (parentComponent as TopicComposite).add(childComponent);
        }
      }
    }

    return rootComponents.map((component) => component.toTreeStructure());
  }

  async getTopic(id: number): Promise<IHierarchicalTopicVersion | null> {
    const topicVersion = await this.topicVersionsRepository.findLatestVersion(id);
    if (!topicVersion) {
      this.logger.warn(`Topic version for topic ${id} not found`);
      return null;
    }

    const rootComponent = new TopicComposite(topicVersion);

    await this.buildTopicTree(rootComponent);
    return rootComponent.toTreeStructure();
  }

  async getTopicByVersion(
    topicId: number,
    version: number,
  ): Promise<IHierarchicalTopicVersion | null> {
    const topicVersion = await this.topicVersionsRepository.findByVersion(topicId, version);
    if (!topicVersion) {
      this.logger.warn(`Topic version for topic ${topicId} and version ${version} not found`);
      return null;
    }

    const rootComponent = new TopicComposite(topicVersion);

    await this.buildTopicTree(rootComponent);

    return rootComponent.toTreeStructure();
  }

  private async buildTopicTree(
    parentComponent: TopicComposite,
  ): Promise<TopicComponent | undefined> {
    const childVersions = await this.topicVersionsRepository.findByParentId(
      parentComponent.getTopicVersion().topicId,
    );
    if (!childVersions) {
      return;
    }

    for (const childVersion of childVersions) {
      const childComponent = new TopicComposite(childVersion);
      parentComponent.add(childComponent);
      await this.buildTopicTree(childComponent);
    }

    return;
  }

  async updateTopic(id: number, topic: Partial<TopicVersion>): Promise<TopicVersion> {
    const currentVersion = await this.topicVersionsRepository.findLatestVersion(id);
    if (!currentVersion) {
      throw new Error(`Topic with id ${id} not found`);
    }

    const newVersion = await TopicVersionFactory.create(currentVersion, topic);
    const createdVersion = await this.topicVersionsRepository.createTopicVersion(newVersion);

    return createdVersion;
  }

  async deleteTopic(id: number): Promise<boolean> {
    const tree = await this.getTopic(id);

    if (!tree) {
      this.logger.warn(`Topic version for topic ${id} not found`);
      return false;
    }

    const topicsToDelete = new Set<number>();

    function traverseTree(tree: IHierarchicalTopicVersion) {
      topicsToDelete.add(tree.topicId);
      for (const child of tree.children || []) {
        traverseTree(child);
      }
    }

    traverseTree(tree);

    for (const topicId of topicsToDelete) {
      const topicVersions = await this.topicVersionsRepository.findByTopicId(topicId);
      for (const version of topicVersions) {
        const resources = await this.resourcesRepository.findByTopicVersionId(version.id);
        for (const resource of resources) {
          await this.resourcesRepository.delete(resource.id);
        }
      }
    }

    for (const topicId of topicsToDelete) {
      const topicVersions = await this.topicVersionsRepository.findByTopicId(topicId);
      for (const version of topicVersions) {
        await this.topicVersionsRepository.delete(version.id);
      }
    }

    for (const topicId of topicsToDelete) {
      await this.topicsRepository.delete(topicId);
    }

    return true;
  }
}
