import { TopicVersion } from '@/features/topics/topic-versions/topic-version.entity';
import { IHierarchicalTopicVersion } from '@/lib/IHierarchicalTopicVersion';

export abstract class TopicComponent {
  constructor(protected topicVersion: TopicVersion) {}

  abstract isComposite(): boolean;
  abstract getChildren(): TopicComponent[];
  abstract add(child: TopicComponent): void;
  abstract remove(child: TopicComponent): void;

  getParentTopicId(): number | null {
    return this.topicVersion.parentTopicId;
  }

  getTopicVersion(): TopicVersion {
    return this.topicVersion;
  }

  toTreeStructure(): IHierarchicalTopicVersion {
    const result: IHierarchicalTopicVersion = {
      id: this.topicVersion.topicId,
      name: this.topicVersion.name,
      content: this.topicVersion.content,
      parentTopicId: this.topicVersion.parentTopicId,
      createdAt: this.topicVersion.createdAt,
      updatedAt: this.topicVersion.updatedAt,
      version: this.topicVersion.version,
      topicId: this.topicVersion.topicId,
      children: this.getChildren().map((child) => child.toTreeStructure()),
      resources: this.topicVersion.resources,
    };

    return result;
  }
}
