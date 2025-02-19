import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { Category } from 'src/entities/category.entity';
import { CreateProductDto } from './dto/createProduct.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['category'] }); // 🔥 Incluimos la categoría
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id }, relations: ['category'] });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return product;
  }

  async search(query: string): Promise<Product[]> {
    return this.productRepository.find({
      where: [
        { name: Like(`%${query}%`) },
        { description: Like(`%${query}%`) },
      ],
      relations: ['category'], // 🔥 También traemos la categoría en la búsqueda
    });
  }

  async create(productData: CreateProductDto): Promise<Product> {
    const category = await this.categoryRepository.findOne({
      where: { id: productData.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    const newProduct = this.productRepository.create({
      ...productData,
      category,
    });

    return this.productRepository.save(newProduct);
  }

  async update(id: string, productData: Partial<CreateProductDto>): Promise<Product> {
    const product = await this.findOne(id);

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    // 🔥 Si se intenta actualizar la categoría, se busca en la base de datos
    if (productData.categoryId) {
      const category = await this.categoryRepository.findOne({ where: { id: productData.categoryId } });

      if (!category) {
        throw new NotFoundException('Categoría no encontrada');
      }

      product.category = category;
    }

    Object.assign(product, productData);
    return this.productRepository.save(product);
  }

  async delete(id: string): Promise<void> {
    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Producto no encontrado');
    }
  }
}
