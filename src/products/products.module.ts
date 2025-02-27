import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { Category } from 'src/entities/category.entity';
import { StockMovements } from 'src/entities/stock-movement.entiy';
import { StockMovementsModule } from 'src/stock-movements/stock-movements.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, StockMovements]),
    StockMovementsModule,
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
