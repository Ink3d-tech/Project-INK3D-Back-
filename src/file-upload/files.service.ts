import { Injectable, NotFoundException } from '@nestjs/common';

import { Repository } from 'typeorm';
import { FileUploadRepository } from './files.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';

@Injectable()
export class FileUploadService {
  constructor(private readonly fileUploadRepository: FileUploadRepository,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}
  async uploadProductImage(file: Express.Multer.File, productId: string) {
    const product = await this.productsRepository.findOneBy({ id: productId });
    if (!product) {
      throw new NotFoundException('product not found');
    }
    const uploadedImage = await this.fileUploadRepository.uploadImage(file)

    await this.productsRepository.update(product.id,{
        image: uploadedImage.secure_url,
    })
    const updateProduct = await this.productsRepository.findOneBy({
        id: productId
    })
    return updateProduct
  }
}
