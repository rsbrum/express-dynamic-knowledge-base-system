import { BaseRepository } from '@/lib/BaseRepository';
import { TopicVersion } from '@/features/topics/topic-versions/topic-version.entity';
import Logger from '@/core/logger';

export class TopicVersionsRepository extends BaseRepository<TopicVersion> {
  private logger = new Logger(TopicVersionsRepository.name);

  constructor() {
    super(TopicVersion);
  }

  async createTopicVersion(topicVersion: Partial<TopicVersion>): Promise<TopicVersion> {
    const newTopicVersion = this.repository.create(topicVersion);
    return await this.repository.save(newTopicVersion);
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

  async findByTopicId(topicId: number): Promise<TopicVersion[]> {
    return await this.repository.find({ where: { topicId } });
  }

  async findLatestVersion(topicId: number): Promise<TopicVersion | null> {
    return await this.repository.findOne({ where: { topicId }, order: { version: 'DESC' } });
  }

  async findByVersion(topicId: number, version: number): Promise<TopicVersion | null> {
    return await this.repository.findOne({ where: { topicId, version } });
  }

  async deleteByTopicById(id: number) {
    const topicVersion = await this.repository.findOne({ where: { topicId: id } });

    if (topicVersion) {
      return await this.repository.remove(topicVersion);
    }

    throw new Error('Topic version not found');
  }

  async delete(id: number) {
    const topicVersion = await this.repository.findOneBy({ id });

    if (!topicVersion) {
      this.logger.warn(`Topic version not found for id: ${id}`);
      return;
    }

    return await this.repository.remove(topicVersion);
  }
}
