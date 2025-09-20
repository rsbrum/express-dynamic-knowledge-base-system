import { Topic } from '@/features/topics/topic.entity';
import { TopicsRepository } from '@/features/topics/topics.repository';
import Logger from '@/core/logger';
import { TopicVersion } from '@/features/topics/topic-versions/topic-version.entity';

import { IHierarchicalTopicVersion } from '@/lib/IHierarchicalTopicVersion';
import { ResourcesRepository } from '@/features/resources/resources.repository';
import { TopicVersionService } from '@/features/topics/topic-versions/topic-version.service';

export class TopicsService {
  private logger = new Logger(TopicsService.name);

  constructor(
    private topicsRepository: TopicsRepository,
    private topicVersionService: TopicVersionService,
    private resourcesRepository: ResourcesRepository,
  ) {}

  async createTopic(topic: Partial<TopicVersion>): Promise<TopicVersion> {
    const newTopic = await this.topicsRepository.createTopic();

    const newTopicVersion = await this.topicVersionService.createTopicVersion({
      ...topic,
      topicId: newTopic.id,
      version: 1,
    });

    return newTopicVersion;
  }

  async getTopics(): Promise<IHierarchicalTopicVersion[]> {
    const topics: Topic[] = await this.topicsRepository.findAllTopics();
    const hierarchicalTopics: IHierarchicalTopicVersion[] = [];

    for (let topic of topics) {
      const hierarchicalTopic = await this.topicVersionService.getLatestTopicVersion(topic.id);
      if (hierarchicalTopic && hierarchicalTopic.parentTopicId === null) {
        hierarchicalTopics.push(hierarchicalTopic);
      }
    }

    return hierarchicalTopics;
  }

  async getTopic(id: number): Promise<IHierarchicalTopicVersion | null> {
    return await this.topicVersionService.getLatestTopicVersion(id);
  }

  async getTopicByVersion(
    topicId: number,
    version: number,
  ): Promise<IHierarchicalTopicVersion | null> {
    return await this.topicVersionService.getTopicByVersion(topicId, version);
  }

  async updateTopic(id: number, topic: Partial<TopicVersion>): Promise<TopicVersion> {
    return await this.topicVersionService.updateTopicVersion(id, topic);
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
      const topicVersions = await this.topicVersionService.getTopicVersionsByTopicId(topicId);
      for (const version of topicVersions) {
        const resources = await this.resourcesRepository.findByTopicVersionId(version.id);
        for (const resource of resources) {
          await this.resourcesRepository.delete(resource.id);
        }
      }
    }

    for (const topicId of topicsToDelete) {
      const topicVersions = await this.topicVersionService.getTopicVersionsByTopicId(topicId);
      for (const version of topicVersions) {
        await this.topicVersionService.deleteTopicVersion(version.id);
      }
    }

    for (const topicId of topicsToDelete) {
      await this.topicsRepository.delete(topicId);
    }

    return true;
  }

  async findShortestPath(fromId: number, toId: number): Promise<number[] | null> {
    const queue: { topicId: number; path: number[] }[] = [{ topicId: fromId, path: [fromId] }];
    const visited = new Set<number>();

    // bfs
    while (queue.length > 0) {
      const { topicId, path } = queue.shift()!;

      if (topicId === toId) {
        return path;
      }

      if (!visited.has(topicId)) {
        visited.add(topicId);

        const topicComponent = await this.topicVersionService.getLatestTopicVersion(topicId);
        if (topicComponent) {
          // downward
          if (topicComponent.children) {
            for (const child of topicComponent.children) {
              if (!visited.has(child.id)) {
                queue.push({ topicId: child.id, path: [...path, child.id] });
              }
            }
          }

          // upward
          if (topicComponent.parentTopicId !== null) {
            const parentId = topicComponent.parentTopicId;
            if (!visited.has(parentId)) {
              queue.push({ topicId: parentId, path: [...path, parentId] });
            }
          }

          // sibling
          if (topicComponent.parentTopicId !== null) {
            const parentComponent = await this.topicVersionService.getLatestTopicVersion(
              topicComponent.parentTopicId,
            );
            if (parentComponent && parentComponent.children) {
              for (const sibling of parentComponent.children) {
                if (sibling.id !== topicId && !visited.has(sibling.id)) {
                  queue.push({ topicId: sibling.id, path: [...path, sibling.id] });
                }
              }
            }
          }
        }
      }
    }

    return null;
  }
}
