import { Topic } from "@/features/topics/topic.entity";

export interface ITopicTree extends Topic {
  children?: ITopicTree[];
}
