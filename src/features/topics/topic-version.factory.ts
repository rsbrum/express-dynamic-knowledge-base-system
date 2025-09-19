import { TopicVersion } from '@/features/topics/topic-version.entity';

export class TopicVersionFactory {
  static createNewVersion(topicVersion: Partial<TopicVersion>): TopicVersion {
    const newVersion = new TopicVersion();
    newVersion.name = topicVersion.name!;
    newVersion.content = topicVersion.content!;
    newVersion.version = topicVersion.version! + 1;
    newVersion.topicId = topicVersion.topicId!;
    newVersion.parentTopicId = topicVersion.parentTopicId!;

    return newVersion;
  }
}
