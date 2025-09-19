import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '@/features/users/user.entity';
import { Topic } from '@/features/topics/topic.entity';
import { Resource } from '@/features/resources/resource.entity';
import { TopicVersion } from '@/features/topics/topic-versions/topic-version.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: './src/core/database/app.db',
  synchronize: true,
  entities: [User, Topic, Resource, TopicVersion],
});
