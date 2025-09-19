import { BaseRepository } from '@/lib/BaseRepository';
import { TopicVersion } from './topic-version.entity';

export class TopicVersionsRepository extends BaseRepository<TopicVersion> {
  constructor() {
    super(TopicVersion);
  }

  async findAllTopics(): Promise<TopicVersion[]> {
    return await this.repository.find();
  }

  async createTopicVersion(topicVersion: Partial<TopicVersion>): Promise<TopicVersion> {
    return await this.repository.save(topicVersion);
  }

  async findLatestVersionByTopicId(topicId: number): Promise<TopicVersion | null> {
    return await this.repository.findOne({ where: { topicId }, order: { version: 'DESC' } });
  }

  async findById(id: number): Promise<TopicVersion | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByParentId(parentId: number): Promise<TopicVersion[]> {
    return await this.repository.find({ where: { parentTopicId: parentId } });
  }

  async findLatestVersion(topicId: number): Promise<TopicVersion | null> {
    return await this.repository.findOne({ where: { topicId }, order: { version: 'DESC' } });
  }

  async findSpecificVersion(topicId: number, version: number): Promise<TopicVersion | null> {
    return await this.repository.findOne({ where: { topicId, version } });
  }
}
