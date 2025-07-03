import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  Check,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { User } from './user.entity';
import { Reviews } from './reviews.entity';
import { StockMovements } from './stock-movement.entiy';
import { DetailsVenta } from './details-sales.entity';

@Entity()
@Check('price >= 0')
@Check('stock >= 0')
@Check('discount >= 0')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column('jsonb', { nullable: true })
  image: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'int', default: 0, nullable: true })
  discount: number;

  @Column({
    type: 'enum',
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    nullable: true,
  })
  size: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  style: string;

  @OneToMany(() => DetailsVenta, (details) => details.product)
  detailsVenta: DetailsVenta[];

  @ManyToMany(() => User, (user) => user.favorites)
  favoritedBy: User[];

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToMany(() => Reviews, (reviews) => reviews.product)
  reviews: Reviews[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => StockMovements, (stockMovements) => stockMovements.product)
  stockMovements: StockMovements[];
}
