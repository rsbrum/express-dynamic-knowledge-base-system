import { BaseRepository } from "@/lib/BaseRepository";
import { Topic } from "@/features/topics/topic.entity";
import Logger from '@/core/logger';

export class TopicsRepository extends BaseRepository<Topic> {
  private logger = new Logger(TopicsRepository.name);

  constructor() {
    super(Topic);
  }

  async findAllTopics(): Promise<Topic[]> {
    return await this.repository.find();
  }

  async createTopic(): Promise<Topic> {
    const topic = this.repository.create({});
    return await this.repository.save(topic);
  }

  async findById(id: number): Promise<Topic | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async delete(id: number) {
    const topic = await this.repository.findOneBy({ id });
    if (!topic) {
      this.logger.warn(`Topic not found for id: ${id}`);
      return;
    }

    return await this.repository.remove(topic);
  }
}
