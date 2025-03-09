import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Magazine } from './magazine.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  text: string;

  @Column('decimal', { nullable: true })
  toxicityScore: number;

  @Column('boolean', { default: false })
  isToxic: boolean;

  @ManyToOne(() => User, user => user.comments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Magazine, magazine => magazine.comments)
  @JoinColumn({ name: 'magazine_id' })
  magazine: Magazine;

  @CreateDateColumn()
  createdAt: Date;
}
