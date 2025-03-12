import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Transactions } from './transaction.entity';
import { DetailsVenta } from './details-sales.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalPrice: number;

  @Column({ type: 'enum', enum: ['USD', 'ARS', 'COP', 'CLP'], default: 'USD' })
  currency: string;

  @OneToMany(() => Transactions, (transaction) => transaction.order)
  transactions: Transactions[];
  @OneToMany(() => DetailsVenta, (details) => details.order)
  detailsVenta: DetailsVenta[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('jsonb', { nullable: false })
  orderDetails: { productId: string; quantity: number; price: number }[];

  @Column({ nullable: true })
  discountCode: string;

  @Column({ nullable: true })
  externalReference: string;
}
