import { TopicVersion } from '@/features/topics/topic-versions/topic-version.entity';

export interface IHierarchicalTopicVersion extends Omit<TopicVersion, 'topic'> {
  children?: IHierarchicalTopicVersion[];
}
