import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity()
export class Reviews {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => Product, (product) => product.reviews)
  product: string;

  @Column()
  description: string;

  @Column()
  rating: number;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;
}
