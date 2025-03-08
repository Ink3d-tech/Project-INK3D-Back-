import { Injectable, NotFoundException } from '@nestjs/common';
import { FileUploadRepository } from './file-upload.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class FileUploadService {
  constructor(
    private fileUploadRepository: FileUploadRepository,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async uploadImage(file: Express.Multer.File) {
    const uploadImage = await this.fileUploadRepository.uploadImage(file);

    return uploadImage.secure_url;
  }

  async uploadProductImage(file: Express.Multer.File, productId: string) {
    const product = await this.productsRepository.findOneBy({ id: productId });

    if (!product) {
      throw new NotFoundException('Product Not Found');
    }
    const uploadImage = await this.fileUploadRepository.uploadImage(file);

    await this.productsRepository.update(product.id, {
      image: [uploadImage.secure_url],
    });

    return await this.productsRepository.findOneBy({ id: productId });
  }

  async uploadUserImage(file: Express.Multer.File, userId: string) {
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const uploadImage = await this.fileUploadRepository.uploadImage(file);

    await this.usersRepository.update(user.id, {
      image: uploadImage.secure_url,
    });

    return await this.usersRepository.findOneBy({ id: userId });
  }
}
