import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity } from "typeorm";

@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int')
  topicId!: number;

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
