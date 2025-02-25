import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { CloudinaryConfig } from 'src/config/cloudinary';
import { FileUploadRepository } from './file-upload.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { Category } from 'src/entities/category.entity';
import { ProductsService } from 'src/products/products.service';
import { StockMovementsService } from 'src/stock-movements/stock-movements.service';
import { StockMovements } from 'src/entities/stock-movement.entiy';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, StockMovements, User]),
  ],
  controllers: [FileUploadController],
  providers: [
    FileUploadService,
    CloudinaryConfig,
    FileUploadRepository,
    ProductsService,
    StockMovementsService,
  ],
})
export class FileUploadModule {}
