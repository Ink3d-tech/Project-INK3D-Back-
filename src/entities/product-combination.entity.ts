import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductCombination {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  size: string;

  @Column()
  color: string;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => Product, (product) => product.combinations, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
