import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { CloudinaryConfig } from 'src/config/cloudinary';
import { FileUploadRepository } from './file-upload.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { Category } from 'src/entities/category.entity';
import { ProductsService } from 'src/products/products.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  controllers: [FileUploadController],
  providers: [
    FileUploadService,
    CloudinaryConfig,
    FileUploadRepository,
    ProductsService,
  ],
})
export class FileUploadModule {}
