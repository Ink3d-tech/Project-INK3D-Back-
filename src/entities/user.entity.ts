import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';
import { Reviews } from './reviews.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ type: 'int' })
  phone: number;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column()
  bio: string;

  @Column({ type: 'enum', enum: ['admin', 'user', 'mod'], default: 'user' })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: ['admin', 'mod', 'user'],
    default: 'user',
  })
  isAdmin: string;

  @ManyToOne(() => User, (user) => user.reviews)
  reviews: Reviews;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @ManyToMany(() => Product, (product) => product.favoritedBy)
  @JoinTable({
    name: 'favorites',
  })
  favorites: Product[];
}
