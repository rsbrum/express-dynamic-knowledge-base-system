import { Topic } from '@/features/topics/topic.entity';
import { TopicDto } from '@/features/topics/topic.dto';
import { TopicsRepository } from '@/features/topics/topics.repository';
import Logger from '@/core/logger';

export class TopicsService {
  private topicsRepository: TopicsRepository;
  private logger = new Logger(TopicsService.name);

  constructor() {
    this.topicsRepository = new TopicsRepository();
  }

  async createTopic(topic: Partial<Topic>) {
    const newTopic = await this.topicsRepository.createTopic(topic);
    this.logger.log(`Topic created: ${newTopic.id} ${newTopic.name}`);

    return newTopic;
  }


  async getTopics(): Promise<TopicDto[]> {
    const topics: TopicDto[] = await this.topicsRepository.findAllTopics();

    // get root nodes
    const rootTopics: TopicDto[] = [];
    for (let topic of topics) {
      topic.children = [];
    }

    for (let topic of topics) {
      if (topic.parentTopicId === null) {
        rootTopics.push(topic);
      } else {
        topics.find((t) => t.id === topic.parentTopicId)?.children?.push(topic);
      }
    }

    return topics.filter((topic) => topic.parentTopicId === null);
  }

  dfs(topic: TopicDto) {
    if (!topic) return;

    return topic;
  }
}
