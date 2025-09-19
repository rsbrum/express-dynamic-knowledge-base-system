import { TopicVersion } from "@/features/topics/topic-version.entity";

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

  // TODO
  // remove any
  // maybe use itopictree
  toTreeStructure(): any {
    const result = {
      id: this.topicVersion.topicId,
      name: this.topicVersion.name,
      content: this.topicVersion.content,
      parentTopicId: this.topicVersion.parentTopicId,
      createdAt: this.topicVersion.createdAt,
      updatedAt: this.topicVersion.updatedAt,
      children: this.getChildren().map(child => child.toTreeStructure())
    };

    return result;
  }
}
