// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   CreateDateColumn,
// } from 'typeorm';
// import { Product } from './product.entity';

// @Entity()
// export class StockMovements {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @ManyToOne(() => Product, (product) => product.stockMovements, {
//     onDelete: 'CASCADE',
//   })
//   product: Product;

//   @Column({ type: 'int' })
//   quantity: number;

//   @Column({
//     type: 'enum',
//     enum: [
//       'purchase',
//       'manual_adjustment',
//       'order_creation',
//       'order_cancellation',
//     ],
//   })
//   type: string;

//   @Column({ type: 'text', nullable: true })
//   reason: string;

//   @CreateDateColumn()
//   createdAt: Date;
// }




// stock-movement.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class StockMovements {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.stockMovements)
  product: Product;

  @Column()
  quantity: number;

  @Column()
  type: string;

  @Column({ nullable: true })
  reason?: string;

  @Column()
  size: string;

  @Column()
  createdAt: Date;
}
