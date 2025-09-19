import { Topic } from '@/features/topics/topic.entity';
import { ITopicTree } from '@/lib/ITopicTree';
import { TopicsRepository } from '@/features/topics/topics.repository';
import Logger from '@/core/logger';
import { TopicVersion } from '@/features/topics/topic-version.entity';
import { TopicVersionsRepository } from '@/features/topics/topic-version.repository';

export class TopicsService {
  private topicsRepository: TopicsRepository;
  private topicVersionsRepository: TopicVersionsRepository;

  private logger = new Logger(TopicsService.name);

  constructor() {
    this.topicsRepository = new TopicsRepository();
    this.topicVersionsRepository = new TopicVersionsRepository();
  }

  async createTopic(topic: Partial<TopicVersion>): Promise<TopicVersion> {
    const newTopic = await this.topicsRepository.createTopic();
    const newTopicVersion = await this.topicVersionsRepository.createTopicVersion({
      ...topic,
      topicId: newTopic.id,
    });

    return newTopicVersion;
  }

  async getTopics(): Promise<ITopicTree[]> {
    const topics: Topic[] = await this.topicsRepository.findAllTopics();
    const topicVersions: TopicVersion[] = [];

    for (let topic of topics) {
      // Use repository directly for data retrieval
      const topicVersion = await this.topicVersionsRepository.findLatestVersion(topic.id);

      if (!topicVersion) {
        this.logger.warn(`No topic version found for topic ${topic.id}`);
        continue;
      }

      topicVersions.push(topicVersion);
    }
    return [];
    /*
    const rootTopics: ITopicTree[] = [];
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

    return topics.filter((topic) => topic.parentTopicId === null);*/
  }

  async getTopic(id: number): Promise<ITopicTree | null> {
    const topic = await this.topicsRepository.findById(id);

    if (!topic) {
      return null;
    }

    // what if topic is a class and it has methods inside of it to fetch the children?

    // get topic children

    const children = await this.topicsRepository.findByParentId(id);
    return this.topicsRepository.findById(id);
  }

  updateTopic(
    id: number,
    topicPayload: { name: string; content: string; parentTopicId: number | null },
  ) {
    return 'Updated';
  }

  deleteTopic(id: number) {
    return 'Deleted';
  }
}
