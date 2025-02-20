import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity'; // ✅ Importamos Category

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])], // ✅ Agregamos Category aquí
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
