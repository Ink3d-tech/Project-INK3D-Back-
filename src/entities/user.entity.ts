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
import { Discounts } from './discounts.entity';
import {  Transactions } from './transaction.entity';
import { Invoice } from './invoice.entity';

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

  @Column({ nullable: true })
  phone: number;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  bio: string;

  @OneToMany(() => Transactions, (transaction) => transaction.user)
  transactions: Transactions[];
    @OneToMany(() => User, (user) => user.invoices)
    invoices: Invoice[];

  @Column({ type: 'enum', enum: ['admin', 'user', 'mod'], default: 'user' })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.reviews)
  reviews: Reviews;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @ManyToMany(() => Product, (product) => product.favoritedBy)
  @JoinTable({
    name: 'favorites',
  })
  @OneToMany(() => Discounts, (discount) => discount.userId)
  @JoinTable({
    name: 'discounts',
  })
  discounts: Discounts[];

  @ManyToMany(() => Product, (product) => product.favoritedBy)
  @JoinTable({
    name: 'favorites',
  })
  favorites: Product[];

  @Column({ nullable: true })
  image: string;
}
