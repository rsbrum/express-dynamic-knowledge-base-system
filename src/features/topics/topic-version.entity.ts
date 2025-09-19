import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Topic } from "./topic.entity";

@Entity()
export class TopicVersion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column('text')
  content!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column('int', { default: 1 })
  version!: number;

  @Column('int', { nullable: true })
  parentTopicId!: number | null;

	@Column('int')
	topicId!: number;

	@ManyToOne(() => Topic)
	@JoinColumn({ name: 'topicId' })
	topic!: Topic;
}
