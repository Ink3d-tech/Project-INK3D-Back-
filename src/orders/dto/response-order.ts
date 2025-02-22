import { IsString } from 'class-validator';
import { Product } from 'src/entities/product.entity';

export class responseOrder {
  @IsString()
  id: string;

  products: Product[];

  priceAtPurchase: number;
}
