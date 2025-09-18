import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '@/features/users/user.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: './src/core/database/app.db',
  synchronize: true,
  entities: [User],
});
