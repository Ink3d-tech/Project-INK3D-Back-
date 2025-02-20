import { Injectable, NotFoundException } from '@nestjs/common';
import { FileUploadRepository } from './file-upload.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/product.entity';

@Injectable()
export class FileUploadService {
  constructor(
    private fileUploadRepository: FileUploadRepository,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async uploadImage(file: Express.Multer.File, productId: string) {
    const product = await this.productsRepository.findOneBy({ id: productId });

    if (!product) {
      throw new NotFoundException('Product Not Found');
    }
    const uploadImage = await this.fileUploadRepository.uploadImage(file);

    await this.productsRepository.update(product.id, {
      image: uploadImage.secure_url,
    });

    return await this.productsRepository.findOneBy({ id: productId });
  }
}
