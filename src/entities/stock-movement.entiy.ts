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
//       'supplies_purchase',
//       'manual_add',
//       'order_creation',
//       'order_cancellation',
//       'manual_take',
//     ],
//   })
//   type: string;

//   @Column({ type: 'text', nullable: true })
//   reason: string;

//   @CreateDateColumn()
//   createdAt: Date;
// }



import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('stock_movements')
export class StockMovements {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.stockMovements, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  previousStock: number;
  

  @Column({ type: 'int' })
  newStock: number; // Nuevo: Para saber el stock después del movimiento

  @Column({
    type: 'enum',
    enum: [
      'initial_stock', // Stock inicial al crear el producto
      'supplies_purchase', // Compra de proveedores
      'manual_add', // Agregado manualmente
      'order_creation', // Venta realizada
      'order_cancellation', // Cancelación de venta (se devuelve stock)
      'manual_take', // Ajuste manual de stock
    ],
  })
  type: string;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @CreateDateColumn()
  createdAt: Date;
}
