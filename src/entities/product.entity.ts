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
} from 'typeorm';
import { Category } from './category.entity';
import { User } from './user.entity';
import { Reviews } from './reviews.entity';
import { ProductCombination } from './product-combination.entity';
import { StockMovements } from './stock-movement.entiy';

@Entity()
@Check('price >= 0')
@Check('discount >= 0')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column('jsonb', { nullable: true })
  image: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'int', default: 0, nullable: true })
  discount: number;

  @ManyToMany(() => User, (user) => user.favorites)
  favoritedBy: User[];

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
  })
  category: Category;

  @OneToMany(() => Reviews, (reviews) => reviews.product)
  reviews: Reviews[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => StockMovements, (stockMovements) => stockMovements.product)
  stockMovements: StockMovements[];

  @OneToMany(() => ProductCombination, (combination) => combination.product, {
    cascade: true,
  })
  combinations: ProductCombination[];
}
