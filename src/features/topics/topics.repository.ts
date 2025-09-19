import { BaseRepository } from "@/lib/BaseRepository";
import { Topic } from "@/features/topics/topic.entity";

export class TopicsRepository extends BaseRepository<Topic> {
  deleteTopic(id: number) {
    throw new Error('Method not implemented.');
  }
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

  async findByParentId(parentId: number): Promise<Topic[]> {
    return [];
    //return await this.repository.find({ where: { parentTopicId: parentId } });
  }
}
