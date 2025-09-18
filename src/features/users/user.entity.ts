import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserRole } from '@/lib/EUserRole';

@Entity()
export class User {

	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	name!: string;

	@Column({unique: true})
	email!: string;

	@Column({
		type: 'text',
		default: UserRole.VIEWER
	})
	role!: UserRole;

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;
}
