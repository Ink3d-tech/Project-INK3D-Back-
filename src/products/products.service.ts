import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { Category } from 'src/entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
<<<<<<< HEAD
=======
import { UpdateProductDto } from './dto/update-product.dto';
>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
<<<<<<< HEAD
=======

>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['category'] });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async search(query: string): Promise<Product[]> {
    return this.productRepository.find({
<<<<<<< HEAD
      where: [
        { name: Like(`%${query}%`) },
        { category: { name: Like(`%${query}%`) } },
      ],
=======
      where: [{ name: Like(`%${query}%`) }, { category: Like(`%${query}%`) }],
>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
      relations: ['category'],
    });
  }

  async create(productData: CreateProductDto): Promise<Product> {
    const category = await this.categoryRepository.findOne({
<<<<<<< HEAD
      where: { id: productData.categoryId },
=======
      where: { id: productData.category[0].id },
>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const newProduct = this.productRepository.create({
      ...productData,
      category,
    });

    return this.productRepository.save(newProduct);
  }

  async updateProduct(
    id: string,
<<<<<<< HEAD
    productData: Partial<CreateProductDto>,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const updatedProduct = await this.productRepository.save({
      ...product,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      stock: productData.stock,
      image: productData.image,
      discount: productData.discount,
    });
    return updatedProduct;
=======
    productData: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (productData.category) {
      const category = await this.categoryRepository.findOne({
        where: { id: productData.category },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      product.category = category;
    }

    Object.assign(product, productData);

    return this.productRepository.save(product);
>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
  }

  async delete(id: string): Promise<void> {
    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Product not found');
    }
  }

<<<<<<< HEAD
  async DeActivevateProduct(id: string): Promise<Product> {
=======
  async deactivateProduct(id: string): Promise<Product> {
>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }
<<<<<<< HEAD
=======

>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
    product.isActive = false;
    return this.productRepository.save(product);
  }

<<<<<<< HEAD
  async ActivevateProduct(id: string): Promise<Product> {
=======
  async activateProduct(id: string): Promise<Product> {
>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }
<<<<<<< HEAD
=======

>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
    product.isActive = true;
    return this.productRepository.save(product);
  }
}
