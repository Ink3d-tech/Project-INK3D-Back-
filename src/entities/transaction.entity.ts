import { User } from './user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => User, (user) => user.transactions)
  user: User;
  @ManyToOne(() => Order, (order) => order.transactions)
  order: Order;
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;
  @Column({ type: 'enum', enum: ['payment', 'refund'] })
  type: 'payment' | 'refund';

  @Column({ type: 'enum', enum: ['completed', 'failed', 'pending'] })
  status: 'completed' | 'failed' | 'pending';

  @Column()
  date: Date;
}
