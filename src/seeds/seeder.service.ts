import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { Category } from 'src/entities/category.entity';
import { User } from 'src/entities/user.entity';
import { Order } from 'src/entities/order.entity';
import * as bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async seed() {
    /** 🔹 1️⃣ Crear Categorías */
    const categoryNames = ['Ropa', 'Calzado', 'Accesorios'];
    const createdCategories: Category[] = await Promise.all(
      categoryNames.map(async (name) => {
        let category = await this.categoryRepository.findOne({
          where: { name },
        });
        if (!category) {
          category = this.categoryRepository.create({ name });
          await this.categoryRepository.save(category);
        }
        return category;
      }),
    );
    const categoryMap = new Map<string, Category>();
    categoryMap.set('ropa', createdCategories[0]);
    categoryMap.set('calzado', createdCategories[1]);
    categoryMap.set('accesorios', createdCategories[2]);

    /** 🔹 2️⃣ Crear Usuarios */
    const usersData = [
      {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        password: '1HulkSmash2025#',
      },
      { name: 'Ana Gómez', email: 'ana@example.com', password: 'Mjolnir2025#' },
      {
        name: 'Admin',
        email: 'admin@example.com',
        password: '@dm!n1234',
        role: 'admin',
      },
    ];

    const createdUsers = await Promise.all(
      usersData.map(async (userData) => {
        let user = await this.userRepository.findOne({
          where: { email: userData.email },
        });
        if (!user) {
          userData.password = await hashPassword(userData.password);
          user = this.userRepository.create(userData);
          await this.userRepository.save(user);
        }
        return user;
      }),
    );
    const userMap = new Map<string, User>();
    userMap.set('juan', createdUsers[0]);
    userMap.set('ana', createdUsers[1]);

    /** 🔹 3️⃣ Crear Productos */
    const existingProducts = await this.productRepository.find();
    if (existingProducts.length === 0) {
      // Solo insertar si no hay productos
      const products: Partial<Product>[] = [
        {
          name: 'Camiseta Negra',
          description: 'Camiseta negra de algodón 100%',
          price: 19.99,
          stock: 50,
          image: 'https://example.com/camiseta-negra.jpg',
          discount: 10,
          category: categoryMap.get('ropa'),
          size: 'M',
          isActive: true,
        },
        {
          name: 'Pantalón Jeans Azul',
          description: 'Pantalón jeans azul de mezclilla',
          price: 39.99,
          stock: 30,
          image: 'https://example.com/jeans-azul.jpg',
          discount: 5,
          category: categoryMap.get('ropa'),
          size: 'L',
          isActive: true,
        },
        {
          name: 'Zapatillas Deportivas',
          description: 'Zapatillas deportivas para correr',
          price: 59.99,
          stock: 20,
          image: 'https://example.com/zapatillas.jpg',
          discount: 15,
          category: categoryMap.get('calzado'),
          size: 'XL',
          isActive: true,
        },
      ];
      await this.productRepository.save(products);
    }

    /** 🔹 4️⃣ Crear Órdenes */
    const existingOrders = await this.orderRepository.find();
    if (existingOrders.length === 0) {
      // Evitar duplicados
      const orders = [
        {
          user: userMap.get('juan'),
          status: 'pending',
          currency: 'USD',
          totalPrice: 79.97,
          orderDetails: [
            {
              productId: existingProducts[0]?.id,
              quantity: 2,
              price: existingProducts[0]?.price,
            },
            {
              productId: existingProducts[1]?.id,
              quantity: 1,
              price: existingProducts[1]?.price,
            },
          ],
        },
        {
          user: userMap.get('ana'),
          status: 'completed',
          currency: 'ARS',
          totalPrice: 59.99,
          orderDetails: [
            {
              productId: existingProducts[2]?.id,
              quantity: 1,
              price: existingProducts[2]?.price,
            },
          ],
        },
      ];
      await this.orderRepository.save(orders);
    }

    console.log(
      '✅ Seed de categorías, productos, usuarios y órdenes completado.',
    );
  }
}
