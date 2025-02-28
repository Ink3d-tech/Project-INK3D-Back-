/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { Category } from 'src/entities/category.entity';
import { User } from 'src/entities/user.entity';
import { Order } from 'src/entities/order.entity';
import { ProductCombination } from 'src/entities/product-combination.entity';
import * as bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

@Injectable()
export class SeederService {
  constructor(
    private readonly connection: Connection,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductCombination)
    private readonly combinationRepository: Repository<ProductCombination>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async seed() {
    console.log('🚀 Iniciando Seed...');
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      /** 🔹 1️⃣ Crear Categorías */
      const categoryNames = ['Ropa', 'Calzado', 'Accesorios'];
      const categories = await Promise.all(
        categoryNames.map(async (name) => {
          let category = await this.categoryRepository.findOne({
            where: { name },
          });
          if (!category) {
            category = this.categoryRepository.create({ name });
            await queryRunner.manager.save(category);
          }
          return category;
        }),
      );

      const categoryMap = new Map<string, Category>();
      categoryMap.set('ropa', categories[0]);
      categoryMap.set('calzado', categories[1]);
      categoryMap.set('accesorios', categories[2]);

      /** 🔹 2️⃣ Crear Productos con Combinaciones */
      const productsData = [
        {
          name: 'Camiseta Negra',
          description: 'Camiseta negra de algodón 100%',
          price: 19.99,
          discount: 5,
          category: categoryMap.get('ropa'),
          image: [],
          isActive: true,
          combinations: [
            { size: 'S', color: 'Negro', stock: 10 },
            { size: 'M', color: 'Negro', stock: 15 },
          ],
        },
        {
          name: 'Zapatillas Deportivas',
          description: 'Zapatillas deportivas para correr',
          price: 59.99,
          discount: 0,
          category: categoryMap.get('calzado'),
          image: [],
          isActive: true,
          combinations: [
            { size: '42', color: 'Blanco', stock: 20 },
            { size: '43', color: 'Negro', stock: 10 },
          ],
        },
      ];

      for (const productData of productsData) {
        const product = this.productRepository.create({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          discount: productData.discount,
          image: productData.image,
          category: productData.category,
          isActive: productData.isActive,
        });

        const savedProduct = await queryRunner.manager.save(product);

        const combinations = productData.combinations.map((comb) =>
          this.combinationRepository.create({
            size: comb.size,
            color: comb.color,
            stock: comb.stock,
            product: savedProduct,
          }),
        );
        await queryRunner.manager.save(combinations);
      }

      await queryRunner.commitTransaction();
      console.log('✅ Seed completado con éxito.');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Error en el Seed:', error);
    } finally {
      await queryRunner.release();
    }
  }
}
