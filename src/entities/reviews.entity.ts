import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Reviews {
  @Column()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  rating: number;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;
}
