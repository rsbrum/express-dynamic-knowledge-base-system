import { TopicComponent } from "@/features/topics/topic-versions/topic-version.component";
import { TopicVersion } from "@/features/topics/topic-versions/topic-version.entity";

export class TopicComposite extends TopicComponent {
  private children: TopicComponent[] = [];

  constructor(topicVersion: TopicVersion) {
    super(topicVersion);
  }

  isComposite(): boolean {
    return true;
  }

  getChildren(): TopicComponent[] {
    return [...this.children];
  }

  add(child: TopicComponent): void {
    if (child.getParentTopicId() === this.topicVersion.topicId) {
      this.children.push(child);
    }
  }

  remove(child: TopicComponent): void {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }

  addChildRecursively(child: TopicComponent): boolean {
    if (child.getParentTopicId() === this.topicVersion.topicId) {
      this.add(child);
      return true;
    }

    for (const existingChild of this.children) {
      if (existingChild.isComposite()) {
        const added = (existingChild as TopicComposite).addChildRecursively(child);
        if (added) {
          return true;
        }
      }
    }

    return false;
  }
}
