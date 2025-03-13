import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { Category } from 'src/entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { StockMovementsService } from 'src/stock-movements/stock-movements.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly stockMovementsService: StockMovementsService,
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
      where: [
        { name: Like(`%${query}%`) },
        { category: { name: Like(`%${query}%`) } },
        { style: Like(`%${query}%`) },
      ],
      relations: ['category'],
    });
  }

  async create(productData: CreateProductDto): Promise<Product> {
    const category = await this.categoryRepository.findOne({
      where: { id: productData.category.id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const newProduct = this.productRepository.create({
      ...productData,
      category,
      style: productData.style ?? 'Motorsport',
    });

    const savedProduct = await this.productRepository.save(newProduct);

    // Registrar el movimiento de stock para el stock inicial
    if (savedProduct.stock > 0) {
      await this.stockMovementsService.createStockMovement({
        productId: savedProduct.id,
        quantity: savedProduct.stock,
        previousStock: 0,
        newStock: savedProduct.stock,
        type: 'initial_stock',
        reason: 'Initial stock entry',
      });
    }
    return savedProduct;
  }
  async findByStyle(style: string): Promise<Product[]> {
    return this.productRepository.find({
      where: { style: Like(`%${style}%`) },
      relations: ['category'],
    });
  }
  async updateProduct(
    id: string,
    productData: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    let stockChange = 0;
    if (productData.category) {
      const category = await this.categoryRepository.findOne({
        where: { id: productData.category.id },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      product.category = category;
    }
    // Calcular cambio en el stock
    if (
      productData.stock !== undefined &&
      productData.stock !== product.stock
    ) {
      stockChange = productData.stock - product.stock;
    }
    // Asignar nuevos valores sin sobrescribir valores no definidos
    Object.assign(product, productData, {
      style: productData.style ?? product.style,
    });
    const updatedProduct = await this.productRepository.save(product);
    if (stockChange !== 0) {
      await this.stockMovementsService.createStockMovement({
        productId: updatedProduct.id,
        quantity: Math.abs(stockChange),
        previousStock: product.stock,
        newStock: updatedProduct.stock,
        type: 'manual_adjustment',
        reason: `Stock updated via product edit: ${stockChange > 0 ? 'increase' : 'decrease'}`,
      });
    }
    return updatedProduct;
  }
  async deactivateProduct(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    product.isActive = false;
    return this.productRepository.save(product);
  }
  async activateProduct(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    product.isActive = true;
    return this.productRepository.save(product);
  }
  async delete(id: string): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Product not found');
    }
  }
}
