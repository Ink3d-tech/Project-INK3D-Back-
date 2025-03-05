import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { Order } from './order.entity';
  import { Product } from './product.entity';
  
  @Entity('details_venta')
  export class DetailsVenta {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => Order, (order) => order.detailsVenta)
  order: Order;

  @ManyToOne(() => Product, (product) => product.detailsVenta)
  product: Product;
  
    @Column({ type: 'int' })
    quantity: number;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;
  }
  