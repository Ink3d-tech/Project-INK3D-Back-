import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Magazine } from './magazine.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @Column()
  username: string;

  @ManyToOne(() => Magazine, (magazine) => magazine.comments, {
    onDelete: 'CASCADE',
  })
  magazine: Magazine;

  @CreateDateColumn()
  createdAt: Date;
}
