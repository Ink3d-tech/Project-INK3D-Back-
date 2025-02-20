// import { Injectable } from '@nestjs/common';
// import { CreateProductDto } from './dto/create-product.dto';
// import { UpdateProductDto } from './dto/update-product.dto';

// @Injectable()
// export class ProductsService {
//   create(createProductDto: CreateProductDto) {
//     return 'This action adds a new product';
//   }

//   findAll() {
//     return `This action returns all products`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} product`;
//   }

//   update(id: number, updateProductDto: UpdateProductDto) {
//     return `This action updates a #${id} product`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} product`;
//   }
// }



import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { categoryId, ...productData } = createProductDto;

    // Buscar la categoría en la base de datos
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const newProduct = this.productRepository.create({
      ...productData,
      category,
    });

    return await this.productRepository.save(newProduct);
  }

  async findAll() {
    return await this.productRepository.find({ relations: ['category'] });
  }

  async findOne(id: string) {
    return await this.productRepository.findOne({ 
      where: { id },
      relations: ['category'], 
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.productRepository.update(id, updateProductDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.productRepository.delete(id);
    return { message: `Product ${id} deleted` };
  }
}
