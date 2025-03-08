import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class StockMovements {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.stockMovements, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column({ type: 'int' })
  quantity: number;

  @Column({
    type: 'enum',
    enum: [
      'purchase',
      'manual_adjustment',
      'order_creation',
      'order_cancellation',
    ],
  })
  type: string;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @CreateDateColumn()
  createdAt: Date;
}
