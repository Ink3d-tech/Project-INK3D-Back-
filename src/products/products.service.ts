import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductCombinationDto } from './dto/product-combination.dto';
import { Product } from 'src/entities/product.entity';
import { UpdateProductCombinationDto } from './dto/update-combination.dto';
import { Category } from 'src/entities/category.entity';
import { ProductCombination } from 'src/entities/product-combination.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductCombination)
    private readonly combinationRepository: Repository<ProductCombination>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly connection: Connection,
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

  async createProduct(
    createProductDto: CreateProductDto,
    combinationsDto: CreateProductCombinationDto[],
  ): Promise<Product> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const category = await this.categoryRepository.findOne({
        where: { id: createProductDto.category[0].id },
      });
      if (!category) {
        throw new NotFoundException('Categoría no encontrada');
      }

      // Creamos la instancia del producto
      const product = this.productRepository.create({
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        discount: createProductDto.discount,
        image: createProductDto.image,
        category: category,
      });

      const savedProduct = await queryRunner.manager.save(product);

      // Creamos las combinaciones vinculándolas al producto creado
      const combinations = combinationsDto.map((dto) => {
        const combination = this.combinationRepository.create({
          size: dto.size,
          color: dto.color,
          stock: dto.stock,
          image: dto.image, // si se envía
          product: savedProduct,
        });
        return combination;
      });

      await queryRunner.manager.save(combinations);
      await queryRunner.commitTransaction();

      return savedProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Actualiza los datos generales del producto y, opcionalmente, sus combinaciones actuales.
   * Se espera que en combinationsDto cada objeto incluya el id de la combinación a actualizar.
   */
  async updateProduct(
    updateProductDto: UpdateProductDto,
    combinationsDto?: UpdateProductCombinationDto[],
  ): Promise<Product> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Buscamos el producto a actualizar, incluyendo sus combinaciones
      const product = await this.productRepository.findOne({
        where: { id: updateProductDto.id },
        relations: ['combinations'],
      });
      if (!product) {
        throw new NotFoundException('Producto no encontrado');
      }

      // Actualizamos los campos generales si fueron proporcionados
      if (updateProductDto.name !== undefined)
        product.name = updateProductDto.name;
      if (updateProductDto.description !== undefined)
        product.description = updateProductDto.description;
      if (updateProductDto.price !== undefined)
        product.price = updateProductDto.price;
      if (updateProductDto.discount !== undefined)
        product.discount = updateProductDto.discount;
      if (updateProductDto.image !== undefined)
        product.image = updateProductDto.image;
      if (updateProductDto.category !== undefined) {
        const category = await this.categoryRepository.findOne({
          where: { id: updateProductDto.category[0].id },
        });
        if (!category) {
          throw new NotFoundException('Categoría no encontrada');
        }
        product.category = category;
      }

      await queryRunner.manager.save(product);

      // Actualizamos las combinaciones existentes si se proporcionan
      if (combinationsDto && combinationsDto.length > 0) {
        for (const dto of combinationsDto) {
          const combination = product.combinations.find(
            (comb) => comb.id === dto.id,
          );
          if (!combination) {
            throw new NotFoundException(
              `Combinación con id ${dto.id} no encontrada en este producto`,
            );
          }
          if (dto.size !== undefined) combination.size = dto.size;
          if (dto.color !== undefined) combination.color = dto.color;
          if (dto.stock !== undefined) combination.stock = dto.stock;
          if (dto.image !== undefined) combination.image = dto.image;

          await queryRunner.manager.save(combination);
        }
      }

      await queryRunner.commitTransaction();
      return product;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Elimina un producto; debido al onDelete: 'CASCADE', se eliminarán las combinaciones asociadas.
   */
  async deleteProduct(productId: string): Promise<void> {
    const result = await this.productRepository.delete(productId);
    if (result.affected === 0) {
      throw new NotFoundException('Producto no encontrado');
    }
  }

  /**
   * Cambia el estado de isActive del producto.
   */
  async toggleProductStatus(productId: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    product.isActive = !product.isActive;
    return await this.productRepository.save(product);
  }
}
