import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TopicVersion } from '@/features/topics/topic-versions/topic-version.entity';

@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int')
  topicVersionId!: number;

  @Column('int')
  topicId!: number;

  @ManyToOne(() => TopicVersion)
  @JoinColumn({ name: 'topicVersionId' })
  topicVersion!: TopicVersion;

  @Column()
  url!: string;

  @Column('text')
  description!: string;

  @Column()
  type!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
