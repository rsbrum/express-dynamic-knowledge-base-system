import { BaseRepository } from "@/lib/BaseRepository";
import { Topic } from "@/features/topics/topic.entity";

export class TopicsRepository extends BaseRepository<Topic> {
  constructor() {
    super(Topic);
  }

	async findAllTopics(): Promise<Topic[]> {
		return await this.repository.find();
	}

	async createTopic(topic: Partial<Topic>): Promise<Topic> {
		return await this.repository.save(topic);
	}

}
