import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
  } from 'typeorm';
import { User } from './user.entity';
import { Magazine } from './magazine.entity';

  
  @Entity()
  export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column('text')
    content: string;
  
    @ManyToOne(() => User, (user) => user.comments)
    user: User;
  
    @ManyToOne(() => Magazine, (magazine) => magazine.comments, { onDelete: 'CASCADE' })
    magazine: Magazine;
  
    @CreateDateColumn()
    createdAt: Date;
  }
  