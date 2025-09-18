import { Topic } from './topic.entity';

export interface TopicDto extends Topic {
  children?: TopicDto[];
}

export interface TopicTreeResponseDto {
  message: TopicDto[];
}
