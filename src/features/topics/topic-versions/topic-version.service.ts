import { TopicVersionsRepository } from "@/features/topics/topic-versions/topic-version.repository";
import { TopicVersion } from '@/features/topics/topic-versions/topic-version.entity';
import { TopicComposite } from '@/features/topics/topic-versions/topic-version.composite';
import { TopicComponent } from '@/features/topics/topic-versions/topic-version.component';
import { TopicVersionFactory } from '@/features/topics/topic-versions/topic-version.factory';
import { IHierarchicalTopicVersion } from '@/lib/IHierarchicalTopicVersion';
import Logger from '@/core/logger';

export class TopicVersionService {
  private logger = new Logger(TopicVersionService.name);

  constructor(private topicVersionsRepository: TopicVersionsRepository) {}

  async createTopicVersion(topicVersion: Partial<TopicVersion>): Promise<TopicVersion> {
    return await this.topicVersionsRepository.createTopicVersion(topicVersion);
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

  async getLatestTopicVersion(topicId: number): Promise<IHierarchicalTopicVersion | null> {
    const topicVersion = await this.topicVersionsRepository.findLatestVersion(topicId);
    if (!topicVersion) {
      this.logger.warn(`Topic version for topic ${topicId} not found`);
      return null;
    }

    const rootComponent = new TopicComposite(topicVersion);
    await this.buildTopicTree(rootComponent);
    return rootComponent.toTreeStructure();
  }

  async updateTopicVersion(topicId: number, updates: Partial<TopicVersion>): Promise<TopicVersion> {
    const currentVersion = await this.topicVersionsRepository.findLatestVersion(topicId);
    if (!currentVersion) {
      throw new Error(`Topic with id ${topicId} not found`);
    }

    const newVersion = await TopicVersionFactory.create(currentVersion, updates);
    const createdVersion = await this.topicVersionsRepository.createTopicVersion(newVersion);
    return createdVersion;
  }

  async getTopicVersionsByTopicId(topicId: number): Promise<TopicVersion[]> {
    return await this.topicVersionsRepository.findByTopicId(topicId);
  }

  async deleteTopicVersion(versionId: number): Promise<void> {
    await this.topicVersionsRepository.delete(versionId);
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
}
