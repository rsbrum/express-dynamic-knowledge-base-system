import { TopicVersion } from '@/features/topics/topic-version.entity';


export class TopicVersionFactory {
  static create(
    currentTopicVersion: TopicVersion,
    newTopicVersion: Partial<TopicVersion>,
  ): TopicVersion {
    const newVersion = new TopicVersion();
    newVersion.name = newTopicVersion.name!;
    newVersion.content = newTopicVersion.content!;
    newVersion.version = currentTopicVersion.version + 1;
    newVersion.topicId = currentTopicVersion.topicId;
    newVersion.parentTopicId = newTopicVersion.parentTopicId!;
    newVersion.resources = currentTopicVersion.resources;

    return newVersion;
  }
}
