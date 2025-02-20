import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { Order } from './order.entity';
import { User } from './user.entity';
import { Reviews } from './reviews.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal')
  price: number;

  @Column('int')
  stock: number;

  @Column()
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'int',
    default: 0,
    nullable: true,
  })
  discount: number;

  @ManyToMany(() => User, (user) => user.favorites)
  favoritedBy: User[];

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
  })
  category: Category;

  @ManyToMany(() => Order, (order) => order.products)
  orders: Order[];

  @OneToMany(() => Reviews, (reviews) => reviews.product)
  reviews: Reviews[];

  @Column({ default: true })
  isActive: boolean;
}
