import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { Category } from 'src/entities/category.entity';
import { StockMovements } from 'src/entities/stock-movement.entiy';
import { ProductCombination } from 'src/entities/product-combination.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Category,
      StockMovements,
      ProductCombination,
    ]),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
