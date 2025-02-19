import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { Category } from 'src/entities/category.entity';


@Module({
  imports:[TypeOrmModule.forFeature([Product,Category])],
  providers: [ProductsService],
  controllers: [ProductsController]
})
export class ProductsModule {}
