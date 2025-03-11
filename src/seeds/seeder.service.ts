import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { Category } from 'src/entities/category.entity';
import { User } from 'src/entities/user.entity';
import { Order } from 'src/entities/order.entity';
import * as bcrypt from 'bcrypt';
import { StockMovements } from 'src/entities/stock-movement.entiy';
import { Magazine } from 'src/entities/magazine.entity';

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
    @InjectRepository(StockMovements)
    private readonly stockMovementRepository: Repository<StockMovements>,
    @InjectRepository(Magazine)
    private readonly magazineRepository: Repository<Magazine>,
  ) { }

  async seed() {
    console.log('🚀 Iniciando Seed...');

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
      {
        name: 'Ana Gómez',
        email: 'ana@example.com',
        password: 'Mjolnir2025#'
      },
      {
        name: 'Admin',
        email: 'admin@example.com',
        password: '@dm!n1234',
        role: 'admin',
      },
      {
        name: 'cami',
        email: 'cami@example.com',
        password: '@dm!n1234',
        role: 'admin',
      },
      {
        name: 'david',
        email: 'david@example.com',
        password: '@dm!n1234',
        role: 'admin',
      },
      {
        name: 'gino',
        email: 'gino@example.com',
        password: '@dm!n1234',
        role: 'admin',
      },
      {
        name: 'facu',
        email: 'facu@example.com',
        password: '@dm!n1234',
        role: 'admin',
      },
      {
        name: 'lau',
        email: 'lau@example.com',
        password: '@dm!n1234',
        role: 'admin',
      },
      {
        name: 'ariel',
        email: 'ariel@example.com',
        password: '@dm!n1234',
        role: 'admin',
      },
      {
        name: 'nacho',
        email: 'nacho@example.com',
        password: '@dm!n1234',
        role: 'admin',
      },
      {
        name: 'mati',
        email: 'matt@example.com',
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
    let existingProducts = await this.productRepository.find();
    if (existingProducts.length === 0) {
      const products: Partial<Product>[] = [
        {
          name: 'Remera senna edition',
          description: 'Remera senna editio limitada',
          price: 1999,
          stock: 25,
          category: categoryMap.get('ropa'),
          style: "Motorsport",
          size: 'M',
          isActive: true,
          image: ["https://i.pinimg.com/736x/16/9a/49/169a497c320601b50225324917ef52e8.jpg"]
        },
        {
          name: 'Campera Ferrari custom',
          description: 'Campera Ferrari custom edicion limitada',
          price: 1999,
          stock: 15,
          category: categoryMap.get('ropa'),
          style: "Motorsport",
          size: 'M',
          isActive: true,
          image: ["https://i.pinimg.com/736x/37/56/db/3756dbb86b5ff642341f6ef7557d1ec6.jpg"]
        },
        {
          name: 'Pantalón sport N6 custom',
          description: 'Pantalón sport N6 custom edicion limitada',
          price: 3999,
          stock: 30,
          category: categoryMap.get('ropa'),
          style: "Streetwear",
          size: 'L',
          isActive: true,
          image: ["https://i.pinimg.com/736x/f0/04/6d/f0046df3f87ce98891f4d355402209b1.jpg"]
        },
        {
          name: 'Zapatillas Nike custom',
          description: 'Zapatillas Nike custom edicion limitada',
          price: 5999,
          stock: 20,
          category: categoryMap.get('calzado'),
          style: "Motorsport",
          size: 'L',
          isActive: true,
          image: ["https://i.pinimg.com/736x/bf/1e/d1/bf1ed18b0380e3624f294b07e818e622.jpg"]
        },
        {
          name: 'Zapatillas Nike custom Shell',
          description: 'Zapatillas Nike custom Shell edicion limitada',
          price: 3999,
          stock: 15,
          category: categoryMap.get('calzado'),
          style: "Motorsport",
          size: 'XL',
          isActive: true,
          image: ["https://i.pinimg.com/736x/dd/7a/af/dd7aafb86cfbb1422909224e7f3902d1.jpg"]
        },
        {
          name: 'Zapatillas Buiton edicion',
          description: 'Zapatillas Buiton edicion limitada',
          price: 5999,
          stock: 10,
          category: categoryMap.get('calzado'),
          style: "Motorsport",
          size: 'XL',
          isActive: true,
          image: ["https://i.pinimg.com/736x/d7/fc/ae/d7fcae3b8197a9acc7c7fbba40b33b30.jpg"]
        },
        {
          name: 'Campera Red Bull Racing',
          description: 'Edición especial de Red Bull Racing con detalles en bordado',
          price: 1899,
          stock: 10,
          category: categoryMap.get('ropa'),
          style: "Motorsport",
          size: 'L',
          isActive: true,
          image: ["https://i.pinimg.com/736x/16/9a/49/169a497c320601b50225324917ef52e8.jpg"]
        },
        {
          name: 'Zapatillas Motorsport AMG',
          description: 'Zapatillas inspiradas en AMG, diseño aerodinámico y suela antideslizante',
          price: 1299,
          stock: 20,
          category: categoryMap.get('calzado'),
          style: "Motorsport",
          size: 'XL',
          isActive: true,
          image: ["https://i.pinimg.com/736x/dd/7a/af/dd7aafb86cfbb1422909224e7f3902d1.jpg"]
        },
        {
          name: 'Camisa Alfa Romeo F1',
          description: 'Camisa oficial de Alfa Romeo F1 Team, edición limitada',
          price: 999,
          stock: 25,
          category: categoryMap.get('ropa'),
          style: "Motorsport",
          size: 'M',
          isActive: true,
          image: ["https://i.pinimg.com/736x/16/9a/49/169a497c320601b50225324917ef52e8.jpg"]
        },
        {
          name: 'Gorra McLaren Pirelli Edition',
          description: 'Gorra McLaren con el icónico logo de Pirelli en el frente',
          price: 499,
          stock: 30,
          category: categoryMap.get('accesorios'),
          style: "Motorsport",
          size: 'XL',
          isActive: true,
          image: ["https://i.pinimg.com/736x/16/9a/49/169a497c320601b50225324917ef52e8.jpg"]
        },
        {
          name: 'Chaqueta Porsche Motorsport',
          description: 'Chaqueta oficial Porsche Motorsport con tecnología cortaviento',
          price: 2100,
          stock: 8,
          category: categoryMap.get('ropa'),
          style: "Motorsport",
          size: 'XL',
          isActive: true,
          image: ["https://i.pinimg.com/736x/37/56/db/3756dbb86b5ff642341f6ef7557d1ec6.jpg"]
        },
        {
          "name": "Camiseta Urban Tokyo",
          "description": "Camiseta de algodón con diseño inspirado en la cultura urbana de Tokio, gráficos minimalistas y ajuste oversize.",
          "price": 2499,
          "stock": 20,
          "category": categoryMap.get("ropa"),
          "style": "Asian",
          "size": "L",
          "isActive": true,
          "image": ["https://i.pinimg.com/736x/9a/4c/3b/9a4c3b36c408866a7d18fbd7f18f5bed.jpg","https://i.pinimg.com/736x/bb/da/55/bbda557c26ae321a27f130a1101ee58b.jpg"]
        },
        {
          "name": "Camiseta Urban Tokyo",
          "description": "Camiseta de algodón con diseño inspirado en la cultura urbana de Tokio, gráficos minimalistas y ajuste oversize.",
          "price": 2499,
          "stock": 50,
          "category": categoryMap.get("ropa"),
          "style": "Streetwear",
          "size": "M",
          "isActive": true,
          "image": ["https://i.pinimg.com/736x/9a/4c/3b/9a4c3b36c408866a7d18fbd7f18f5bed.jpg","https://i.pinimg.com/736x/bb/da/55/bbda557c26ae321a27f130a1101ee58b.jpg"]
        },
        {
          "name": "Zapatillas Street Edge",
          "description": "Zapatillas de suela gruesa con detalles en cuero sintético, perfectas para un look urbano y moderno.",
          "price": 5299,
          "stock": 18,
          "category": categoryMap.get("calzado"),
          "style": "Streetwear",
          "size": "XL",
          "isActive": true,
          "image": ["https://i.pinimg.com/736x/69/ba/bb/69babba7cf8fa78d01333a7a20da840c.jpg","https://i.pinimg.com/736x/ed/b3/c8/edb3c8c8153544de0a6444f4992091a8.jpg"]
        },
        {
          "name": "Buzo Harajuku Night",
          "description": "Buzo estilo bomber con patrones inspirados en la moda de Harajuku, forro interior suave.",
          "price": 4599,
          "stock": 12,
          "category": categoryMap.get("ropa"),
          "style": "Asian",
          "size": "L",
          "isActive": true,
          "image": ["https://i.pinimg.com/736x/55/05/71/55057121f8dfb8939be45b151b78562e.jpg"]
        },
        {
          "name": "Joggers Cyberpunk",
          "description": "Pantalón jogger con bolsillos funcionales y diseño técnico inspirado en el estilo cyberpunk de las calles de Shibuya.",
          "price": 3799,
          "stock": 22,
          "category": categoryMap.get("ropa"),
          "style": "Streetwear",
          "size": "M",
          "isActive": true,
          "image": ["https://i.pinimg.com/736x/a2/79/26/a27926f0f468df4d2c476862f859b5e8.jpg", "https://i.pinimg.com/736x/ac/d6/5e/acd65ee38f5d7c891ce1747963590183.jpg"]
        },
        {
          "name": "Joggers Cyberpunk",
          "description": "Pantalón jogger con bolsillos funcionales y diseño técnico inspirado en el estilo cyberpunk de las calles de Shibuya.",
          "price": 3799,
          "stock": 22,
          "category": categoryMap.get("ropa"),
          "style": "Streetwear",
          "size": "L",
          "isActive": true,
          "image": ["https://i.pinimg.com/736x/a2/79/26/a27926f0f468df4d2c476862f859b5e8.jpg", "https://i.pinimg.com/736x/ac/d6/5e/acd65ee38f5d7c891ce1747963590183.jpg"]
        },
        {
          "name": "Chaqueta Samurai Flow",
          "description": "Chaqueta estilo bomber con bordados inspirados en samuráis, tejido premium y ajuste perfecto para un estilo elegante y moderno.",
          "price": 4999,
          "stock": 12,
          "category": categoryMap.get("ropa"),
          "style": "Asian",
          "size": "M",
          "isActive": true,
          "image": ["https://i.pinimg.com/736x/55/59/60/555960ea4c1a6e7ea32295d1e553c5b2.jpg", "https://i.pinimg.com/736x/ff/f4/2b/fff42b0c379bbcc5375ec4cf159ee095.jpg"]
        },
        {
          "name": "Chaqueta Samurai Flow",
          "description": "Chaqueta estilo bomber con bordados inspirados en samuráis, tejido premium y ajuste perfecto para un estilo elegante y moderno.",
          "price": 4999,
          "stock": 12,
          "category": categoryMap.get("ropa"),
          "style": "Asian",
          "size": "S",
          "isActive": true,
          "image": ["https://i.pinimg.com/736x/55/59/60/555960ea4c1a6e7ea32295d1e553c5b2.jpg", "https://i.pinimg.com/736x/ff/f4/2b/fff42b0c379bbcc5375ec4cf159ee095.jpg"]
        },
        {
          "name": "Pantalón Kanji Oversize",
          "description": "Pantalón ancho con estampado de kanjis y diseño inspirado en la moda urbana japonesa.",
          "price": 4299,
          "stock": 20,
          "category": categoryMap.get("ropa"),
          "style": "Asian",
          "size": "L",
          "isActive": true,
          "image": ["https://i.pinimg.com/736x/8f/67/2f/8f672f952b4bfda7be570c3b750eb150.jpg", "https://i.pinimg.com/736x/73/90/76/7390760ef10ecb74d326bba5f7608876.jpg", "https://i.pinimg.com/736x/22/96/fa/2296fabcca02ab1c5cb83ebf6968e4c1.jpg"]
        },
      ];
    // await this.productRepository.save(products);
    // console.log("✅ Productos insertados correctamente en la base de datos.");
  
    // /** 🔹 3.1️⃣ Crear movimientos de stock inicial */
    // for (const product of products) {
    //   await this.stockMovementRepository.insert({
    //     product,
    //     quantity: product.stock, // Stock inicial
    //     previousStock: 0, // No había stock antes
    //     newStock: product.stock, // Nuevo stock después del movimiento
    //     type: "initial_stock",
    //     reason: "Stock inicial",
    //   });
    await this.productRepository.save(products);
  console.log("✅ Productos insertados correctamente en la base de datos.");

  // 2️⃣ Recuperar los productos insertados para asegurar que tienen IDs
  const savedProducts = await this.productRepository.find();
  
  // 3️⃣ Crear movimientos de stock inicial usando los productos correctos
  for (const product of savedProducts) {
    await this.stockMovementRepository.insert({
      product,
      quantity: product.stock, // Stock inicial
      previousStock: 0, // No había stock antes
      newStock: product.stock, // Nuevo stock después del movimiento
      type: "initial_stock",
      reason: "Stock inicial",
    });
    }
    
    /** 🔹 4️⃣ Crear Órdenes */
    const existingOrders = await this.orderRepository.find();
    if (existingOrders.length === 0) {
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

    /** 🔹 5️⃣ Crear Movimientos de Stock */
    const existingStockMovements = await this.stockMovementRepository.find();
    if (existingStockMovements.length === 0) {
      const stockMovements: Partial<StockMovements>[] = [
        {
          product: existingProducts[0],
          quantity: 50,
          type: 'manual_add',
          reason: 'Initial stock',
        },
        {
          product: existingProducts[1],
          quantity: 30,
          type: 'manual_add',
          reason: 'Initial stock',
        },
        {
          product: existingProducts[2],
          quantity: 20,
          type: 'manual_add',
          reason: 'Initial stock',
        },
        {
          product: existingProducts[3],
          quantity: 5,
          type: 'manual_add',
          reason: 'Initial stock',
        },
      ];
      await this.stockMovementRepository.save(stockMovements);
    }

    /** 🔹 6️⃣ Crear Posts en Magazine */
    const existingPosts = await this.magazineRepository.find();
    if (existingPosts.length === 0) {
      const posts: Partial<Magazine>[] = [
        {
          category: 'MOTORSPORT',
          title: 'Influencia del Automovilismo en la Moda',
          content:
            'El auge de la Fórmula 1, el drifting y el tuning en Asia ha impulsado una moda que mezcla tecnología y adrenalina. Equipos y marcas han colaborado para crear prendas que capturan la esencia del motorsport, desde chaquetas inspiradas en los pits hasta camisetas con gráficos de alto octanaje.',
          image:
            'https://i.pinimg.com/736x/bf/1e/d1/bf1ed18b0380e3624f294b07e818e622.jpg',
          author: 'Camilo C',
        },
        {
          category: 'MUNDO ASIAN',
          title: 'El Legado Japonés y la Cultura JDM',
          content:
            'Japón ha sido pionero en fusionar la cultura automovilística con el streetwear. La escena JDM y las icónicas carreras callejeras han influenciado marcas que incorporan colores vibrantes, logos de escuderías y tipografías técnicas en sus diseños.',
          image:
            'https://i.pinimg.com/736x/f2/ff/b2/f2ffb25e1c23e2887642683567c8408b.jpg',
          author: 'Laura P',
        },
        {
          category: 'STREETWEAR',
          title: 'Tendencia en China y Corea del Sur',
          content:
            'Tendencia en China y Corea del SurCon la creciente popularidad de los deportes de motor, las marcas asiáticas han llevado la moda motorsport al siguiente nivel. Colaboraciones exclusivas entre diseñadores y fabricantes de automóviles han generado colecciones limitadas que combinan innovación, estilo y funcionalidad.',
          image:
            'https://i.pinimg.com/736x/73/ca/d8/73cad83cba5eff4254c0f842afebe448.jpg',
          author: 'Pedro R',
        },
      ];
      await this.magazineRepository.save(posts);
    }

    console.log(
      '✅ Seed de categorías, productos, usuarios, órdenes, movimientos de stock y posts en magazine completado.',
    );
  }
}
}
