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
        name: 'Juan Pérez', email: 'juan@example.com', password: '1HulkSmash2025#',
      },
      {
        name: 'Ana Gómez', email: 'ana@example.com', password: 'Mjolnir2025#'
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
          name: 'Campera Ferrari custom',
          description: 'Campera Ferrari custom edicion limitada',
          price: 1999,
          stock: 20,
          category: categoryMap.get('ropa'),
          style: "Motorsport",
          size: 'S',
          isActive: true,
          image: ["https://i.pinimg.com/736x/37/56/db/3756dbb86b5ff642341f6ef7557d1ec6.jpg"]
        },
        {
          name: 'Campera Ferrari custom',
          description: 'Campera Ferrari custom edicion limitada',
          price: 1999,
          stock: 20,
          category: categoryMap.get('ropa'),
          style: "Motorsport",
          size: 'L',
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
          name: 'Pantalón sport N6 custom',
          description: 'Pantalón sport N6 custom edicion limitada',
          price: 3999,
          stock: 30,
          category: categoryMap.get('ropa'),
          style: "Streetwear",
          size: 'XL',
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
          name: 'Campera Red Bull Racing',
          description: 'Edición especial de Red Bull Racing con detalles en bordado',
          price: 1899,
          stock: 10,
          category: categoryMap.get('ropa'),
          style: "Motorsport",
          size: 'M',
          isActive: true,
          image: ["https://i.pinimg.com/736x/16/9a/49/169a497c320601b50225324917ef52e8.jpg"]
        },
        {
          name: 'Campera Red Bull Racing',
          description: 'Edición especial de Red Bull Racing con detalles en bordado',
          price: 1899,
          stock: 10,
          category: categoryMap.get('ropa'),
          style: "Motorsport",
          size: 'XL',
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
          name: 'Camisa Alfa Romeo F1',
          description: 'Camisa oficial de Alfa Romeo F1 Team, edición limitada',
          price: 999,
          stock: 20,
          category: categoryMap.get('ropa'),
          style: "Motorsport",
          size: 'S',
          isActive: true,
          image: ["https://i.pinimg.com/736x/16/9a/49/169a497c320601b50225324917ef52e8.jpg"]
        },
        {
          name: 'Camisa Alfa Romeo F1',
          description: 'Camisa oficial de Alfa Romeo F1 Team, edición limitada',
          price: 999,
          stock: 20,
          category: categoryMap.get('ropa'),
          style: "Motorsport",
          size: 'L',
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
          "image": ["https://i.pinimg.com/736x/9a/4c/3b/9a4c3b36c408866a7d18fbd7f18f5bed.jpg", "https://i.pinimg.com/736x/bb/da/55/bbda557c26ae321a27f130a1101ee58b.jpg"]
        },
        {
          "name": "Camiseta Urban Tokyo",
          "description": "Camiseta de algodón con diseño inspirado en la cultura urbana de Tokio, gráficos minimalistas y ajuste oversize.",
          "price": 2499,
          "stock": 50,
          "category": categoryMap.get("ropa"),
          "style": "Asian",
          "size": "M",
          "isActive": true,
          "image": ["https://i.pinimg.com/736x/9a/4c/3b/9a4c3b36c408866a7d18fbd7f18f5bed.jpg", "https://i.pinimg.com/736x/bb/da/55/bbda557c26ae321a27f130a1101ee58b.jpg"]
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
          "image": ["https://i.pinimg.com/736x/69/ba/bb/69babba7cf8fa78d01333a7a20da840c.jpg", "https://i.pinimg.com/736x/ed/b3/c8/edb3c8c8153544de0a6444f4992091a8.jpg"]
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
      await this.productRepository.save(products);
      console.log("✅ Productos insertados correctamente en la base de datos.");

      // 2️⃣ Recuperar los productos insertados para asegurar que tienen IDs
      const savedProducts = await this.productRepository.find();

      // 3️⃣ Crear movimientos de stock inicial usando los productos correctos
      for (const product of savedProducts) {
        await this.stockMovementRepository.insert({
          product,
          quantity: product.stock, 
          previousStock: 0, 
          newStock: product.stock,
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
              category: 'MUNDO ASIAN',
              title: '¿Por qué es tan cool  Asian Style?',
              content:
                ' El Asian Style no sigue tendencias, las crea. Mientras en otros lugares la moda tarda en evolucionar, en Asia las calles son pasarelas vivas donde cada prenda tiene actitud. Se trata de jugar con texturas, siluetas oversized y prendas funcionales que te hacen ver como salido de una película cyberpunk.Las piezas clave para dominar el look:Cortavientos techwear  Ligero, futurista y perfecto para el caos urbano.Pantalones cargo ultra cómodos Bolsillos estratégicos para guardar desde el celular hasta los snacks.Sneakers chunky o minimalistas  Todo depende de qué tan "extra" quieras ser.Camisetas oversized con tipografías asiáticas – Porque un buen print siempre dice algo, aunque no entiendas qué.Tip de INK3D:El truco del Asian Style está en mezclar sin miedo: prueba un pantalón ancho con un top ajustado o una chaqueta oversized con sneakers futuristas. Recuerda, más que un outfit, es una actitud.',
              image:
                'https://i.pinimg.com/736x/44/60/d7/4460d73f5184e3ef7a5ba50180e93f56.jpg',
              author: 'Emma Blue',
            },
            {
              category: 'MUNDO ASIAN',
              title: 'De las Calles de Tokio a Tu Clóset',
              content:
                'De las Calles de Tokio a Tu Clóset Si hay algo que define al Asian Style, es su capacidad de mezclar tradición con modernidad sin perder flow. En ciudades como Tokio y Seúl, la moda es un laboratorio donde cada persona es su propio diseñador. ¿El resultado? Looks únicos que combinan funcionalidad, minimalismo y un toque futurista que parece sacado de un videojuego¿Qué hace diferente al Asian Style?Este estilo no se basa en seguir tendencias, sino en crear una estética personal. Desde prendas oversized hasta techwear de alto rendimiento, cada outfit es una declaración de identidad. En Japón, el street style se divide entre la estética vanguardista de Harajuku y el futurismo del techwear. En Corea, la moda apuesta por siluetas limpias y elegantes, mientras que en China, los estampados gráficos y las tipografías juegan un papel clave Tip de INK3D:Si quieres adoptar el Asian Style, piensa en capas. Un cortavientos ligero sobre una hoodie oversized y unos pantalones cargo pueden transformar un look básico en algo digno de un desfile de moda en Shibuya. Atrévete a jugar con texturas y cortes, porque aquí las reglas las pones tú..',
              image:
                'https://i.pinimg.com/736x/ac/45/88/ac45887662236b9bd4c469e6b57908bf.jpg',
              author: 'Emma Blue',
            },
            {
              category: 'MUNDO ASIAN',
              title: 'Raíces Tradicionales',
              content:
                'Antes de que el K-fashion y el J-fashion tomaran las pasarelas, la vestimenta en Asia estaba marcada por siglos de tradiciones:Kimono (Japón): Prenda icónica con estampados detallados y siluetas fluidas. Hanbok (Corea del Sur): Vestido tradicional con colores vibrantes y líneas elegantes. Cheongsam o Qipao (China): Vestido ajustado con cortes sensuales y patrones sofisticados.A pesar de su antigüedad, estos estilos siguen influyendo en la moda contemporánea, desde reinterpretaciones en pasarelas hasta adaptaciones en el streetwear.El Boom del Asian Street StyleEn los últimos años, el streetwear asiático ha redefinido la moda global. Ciudades como Tokio, Seúl y Shanghái se han convertido en epicentros de tendencias.Japón y el Harajuku Style:Tokio es la cuna de estilos extravagantes como el Lolita, Visual Kei y Gyaru, donde la individualidad es clave. Marcas como Comme des Garçons y BAPE combinan lo excéntrico con lo vanguardista.Corea del Sur y la Moda K-pop:El auge del K-pop ha impulsado un estilo fresco y juvenil con prendas oversized, chaquetas bomber, sneakers chunky y accesorios llamativos. Marcas como Stylenanda y Ader Error han popularizado esta estética. China y el Techwear:El estilo futurista y cyberpunk ha tomado fuerza en ciudades como Shanghái, con prendas funcionales, tonos oscuros y accesorios inspirados en la ciencia ficción.La Influencia en la Moda GlobalLa cultura asiática no solo ha impactado el street style, sino que también ha llegado a las grandes marcas de lujo. Diseñadores asiáticos como Yohji Yamamoto, Rei Kawakubo y Alexander Wang han dejado huella en la industria con su visión única..',
              image:
                'https://i.pinimg.com/736x/5a/7e/b3/5a7eb3cce604b58ffb0a068e2c1d66e2.jpg',
              author: 'Emma Blue',
            },
            {
              category: 'MUNDO ASIAN',
              title: 'La escena JMD y las icónicas carreras',
              content:
                'Japón ha sido pionero en fusionar la cultura automovilística con el streetwear. La escena JDM y las icónicas carreras callejeras han influenciado marcas que incorporan colores vibrantes, logos de escuderías y tipografías técnicas en sus diseños.',
              image:
                'https://i.pinimg.com/736x/f6/ef/06/f6ef0659cf6339d50dec08070c5bdd94.jpg',
              author: 'Emma Blue',
            },
            {
              category: 'STREETWEAR',
              title: 'Del K-Fashion al Harajuku: Explora el Estilo Asiático',
              content:
                'En Tokio, el techwear domina las calles con prendas de inspiración militar y tejidos técnicos. En Seúl, la moda se inclina por cortes limpios y siluetas estructuradas, mientras que en Shanghái, la experimentación con estampados, tipografías y colores crea looks atrevidos.Prendas Clave:Chaquetas bomber y cortavientos con acabados técnicos Pantalones cargo de inspiración utilitaria.Camisetas oversized con gráficos sutiles.Sneakers chunky o minimalistas, dependiendo del enfoque del look Tip de INK3D:Para lograr un look Asian Style, juega con las capas y los contrastes. Mezcla un cortavientos con un pantalón de sastrería relajado y sneakers con suela gruesa. Menos es más, pero siempre con intención..',
              image:
                'https://i.pinimg.com/736x/73/ca/d8/73cad83cba5eff4254c0f842afebe448.jpg',
              author: 'Emma blue',
            },
            {
            category: 'STREETWEAR',
            title: '¿Joggers: De Pantalón de Gym a Rey del Streetwear',
            content:
              ' Hubo un tiempo en el que los joggers eran solo para hacer ejercicio o para quedarse en casa viendo series. Pero en algún punto, alguien decidió que no solo eran cómodos, sino que también podían ser estilosos. Y así nació una revolución en la moda urbana.¿Qué son los joggers?Los joggers son pantalones con un corte más ajustado en la parte inferior, usualmente con puños elásticos en los tobillos. Se diferencian de los pantalones deportivos clásicos porque tienen un diseño más entallado y moderno, lo que los hace perfectos para combinarlos con zapatillas llamativas y sudaderas oversize.¿Cómo usarlos sin parecer recién salido de la cama?Casual pero cool: Combínalos con una camiseta básica y zapatillas blancas. Fácil y sin fallos.Elegancia relajada: Un jogger negro con una chaqueta bomber y una gorra te da un look más sofisticado.Streetwear total: Súmale una sudadera oversized y unas sneakers chunky. Parecerás una estrella del hip-hop.¿Por qué todo el mundo los ama? Comodidad nivel "quiero vivir con ellos"  Versatilidad para cualquier ocasión casual Son un must en la moda urbana actualLos joggers ya no son solo para correr o hacer mandados. Se han convertido en un básico del streetwear, combinando comodidad y estilo sin esfuerzo. Así que si aún no tienes un par,¿qué estás esperando?.',
            image:
              'https://i.pinimg.com/736x/eb/72/3a/eb723aa037b758a6677fc2ca184716d3.jpg',
            author: 'Emma Blue',
            
          },
  
          {
            category: 'STREETWEAR',
            title: 'Street Style: La Revolución de la Moda en las Calles',
            content:
              'El street style no nació en las pasarelas, sino en los barrios donde la cultura y la identidad se expresaban a través de la ropa. En Nueva York, el Bronx y Harlem fueron cuna del hip-hop, donde los hoodies oversized y los sneakers llamativos se convirtieron en insignias de la calle. En Los Ángeles, South Central y Compton popularizaron los baggy jeans y las camisetas deportivas dentro del cholo style. En Tokio, Harajuku revolucionó la moda con combinaciones audaces, mientras que en Londres, Brixton y Camden mezclaron la rebeldía del punk con la funcionalidad del sportswear.Hoy, esta estética ha evolucionado en una fusión de prendas amplias, sneakers statement y detalles funcionales que reflejan la actitud de la ciudad.Prendas Clave:Hoodies anchos con gráficos  Una pieza esencial del streetwear, combinando comodidad y mensaje visual.Sneakers icónicos como las Air Jordan 1De las canchas de baloncesto a las calles, representan estatus y cultura.Pantalones cargo o baggy jeans  Inspirados en la ropa de trabajo, ofrecen movilidad y un look relajado pero imponente.Gorras y beanies Complementos clave que aportan un toque effortless y refuerzan la identidad del outfitTip de INK3D:Para dominar el street style, el truco está en la proporción. Si llevas un hoodie oversized, equilibra con pantalones más ajustados o viceversa. Añade sneakers llamativos para definir tu personalidad y deja que los accesorios hablen de tu actitud..',
            image:
              'https://i.pinimg.com/736x/dc/ee/ca/dceecac414e7db42837cae73a85cb611.jpg',
            author: 'Emma Blue',
          },
          {
            category: 'STREETWEAR',
            title: ' Juega con las Siluetas: Oversized, Pero con Flow',
            content:
              'En el streetwear, la clave no está en la marca, sino en la forma en que usas las prendas. Aquí, el volumen manda y las reglas las pones tú.¿Cómo combinar bien las siluetas?Hoodie oversized + joggers ajustados → Cómodo y con forma.Camiseta fit + pantalón baggy → Relajado pero con intención.Cortavientos voluminoso + jeans slim → Sporty con un toque limpio.Full oversized → Si lo haces bien, es puro fuego.Tip INK3D: Usa capas. Hoodie bajo cortavientos, camiseta larga con chaqueta... mezcla texturas y volúmenes hasta encontrar TU estilo.',
            image:
              'https://i.pinimg.com/736x/bb/78/73/bb78733ed77920fd3cb16f2497b67778.jpg',
            author: 'Emma Blue',
          },
          {
            category: 'STREETWEAR',
            title: 'Celebs Que Llevan el Streetwear a Otro Nivel',
            content:
              'El streetwear dejó de ser solo un estilo de la calle y ahora domina alfombras rojas, front rows y feeds de Instagram. Estas celebridades no solo lo usan, lo elevan.1. Travis Scott: El Rey del HypeSi hay alguien que define el streetwear actual, es Travis Scott. Sus colaboraciones con Nike y Jordan han creado algunas de las sneakers más codiciadas del mundo. Su sello: oversized hoodies, pantalones cargo y dunks hypeadas.Clave de su estilo: Siluetas relajadas y colores tierra.2. Rihanna: Reina del Oversized Rihanna mezcla el streetwear con el high fashion como nadie. Desde hoodies XXL hasta sneakers chunky, siempre añade un toque sofisticado con accesorios.+ Clave de su estilo: Juega con proporciones, usando piezas masculinas con detalles femeninos.3. A$AP Rocky: El Fashion KillaA$AP Rocky es la definición de lujo urbano. Mezcla Supreme con Raf Simons, Balenciaga con Nike y siempre está un paso adelante en tendencias. Clave de su estilo: Arriesga con colores y prints sin perder la esencia street. 4. Hailey Bieber: Minimalismo con Actitud Hailey combina básicos del streetwear con piezas más pulidas. Piensa en hoodies cropped, sneakers limpios y gafas futuristas.Clave de su estilo: Menos es más. Looks relajados pero siempre impecables.Tip INK3D: El streetwear es personalidad. No se trata solo de marcas caras, sino de cómo combinas piezas y las haces tuyas..',
            image:
              'https://i.pinimg.com/736x/c9/a6/3e/c9a63ef1bf8ce25f87c0fc92a0b4c937.jpg',
            author: 'Emma Blue',
          },
          {
            category: 'MOTORSPORT',
            title: 'Lewis Hamilton: La Fórmula 1 del Estilo',
            content:
              'Lewis Hamilton no solo domina la pista, también la industria de la moda. Su estilo arriesgado, lleno de colores vibrantes, siluetas oversized y marcas de lujo, lo ha convertido en un referente del streetwear y la moda deportiva. De los Pits a las PasarelasHamilton ha trabajado con Tommy Hilfiger en colecciones que mezclan su amor por la velocidad con el street style. También ha sido visto en piezas de Off-White, Balenciaga y Rick Owens, probando que la moda y el motorsport pueden ir de la mano. Su Fórmula GanadoraHoodies y chaquetas oversized  Cómodo, pero con presencia.Colores llamativos y estampados Nada de pasar desapercibido.Sneakers chunky y botas futuristas Siempre con actitud.Accesorios atrevidos – Gafas de sol llamativas y cadenas statement.Tip INK3D: Atrévete a jugar con la moda como Hamilton. Mezcla prendas deportivas con piezas de lujo y usa los accesorios para elevar el look..',
            image:
              'https://i.pinimg.com/736x/13/1b/8b/131b8b541996cfdc18d6833dce1465b7.jpg',
            author: 'Emma Blue',
          },
          {
            category: 'MOTORSPORT',
            title: 'El Mundo de la F1: Más Que Autos Rápidos',
            content:
              'La Fórmula 1 no es solo un deporte, es un universo de velocidad, lujo y estilo. Desde los monos de carrera icónicos hasta las colaboraciones con grandes marcas, la F1 ha influenciado el streetwear de formas inesperadas Moda y Motorsport: Un Romance en Aceleración Chaquetas racing  Inspiradas en los uniformes de pilotos, marcas como INK3D han reinventado esta pieza.Sneakers de alto rendimiento  Puma y Nike han lanzado zapatillas con tecnología inspirada en la F1. Gorras y accesorios con branding Ferrari, Mercedes y McLaren tienen colecciones que van más allá del merchandising. De la Pista a la CallePilotos como Lewis Hamilton y Charles Leclerc han llevado el estilo F1 fuera del paddock, combinando piezas deportivas con elementos de lujo y streetwear.Tip INK3D: Una chaqueta racing es una pieza clave para cualquier outfit urbano. Combínala con jeans baggy y sneakers para un look con actitud..',
            image:
              'https://i.pinimg.com/736x/d5/60/1a/d5601a9ec2debf8f514694b5b5416a44.jpg',
            author: 'Emma Blue',
          },
          {
            category: 'MOTORSPORT',
            title: ' Biker Core: La Rebeldía de la Pista a las Calles"',
            content:
              'El Biker Core es la moda inspirada en los motociclistas, con una estética ruda, funcional y llena de actitud. Nacida en la cultura de los corredores de motos y el rock, esta tendencia se fusiona con el motorsport al compartir el amor por la velocidad y la adrenalina ¿Por qué el Biker Core sigue dominando?Prendas diseñadas para resistir – Cuero grueso, textiles reforzados y detalles metálicos. Estética atemporal  No pasa de moda, solo evoluciona con nuevas siluetas. Influencias en el streetwear  Marcas como Balenciaga y Supreme han reinventado este estilo.Piezas clave del Biker Core: Chaquetas de cuero con parches o estampados – Una pieza infaltable.Pantalones de cuero o denim desgastado – Ajustados o holgados, pero siempre con actitud.Botas o sneakers robustos – Listos para la acción. Guantes y gafas deportivas – Pequeños detalles que completan el look. Tip INK3D: Para un Biker Core moderno, mezcla una chaqueta de cuero con jeans baggy y sneakers de suela gruesa..',
            image:
              'https://i.pinimg.com/736x/f5/4d/60/f54d609cdfe7bc88b636145936d0145d.jpg',
            author: 'Emma Blue',
          },
          {
            category: 'MOTORSPORT',
            title: 'Las Chaquetas de Pits: De las Carreras a la Calle',
            content:
              'pasado de ser una prenda exclusiva del automovilismo a convertirse en un icono del streetwear. Con colores llamativos, logos de patrocinadores y un aire retro que grita velocidad, estas chaquetas han tomado las calles con un estilo audaz y rebelde.¿Qué son las chaquetas de pits Originalmente diseñadas para los mecánicos y pilotos en los pits de las carreras de Fórmula 1, NASCAR y MotoGP, estas chaquetas se caracterizan por:Material resistente, ideal para protegerse del frío y el viento. Diseños llamativos, con parches y estampados de marcas famosas. Ajuste oversized, perfecto para un look relajado pero poderoso .De la pista a la moda urbanaDesde los años 90, las chaquetas de pits empezaron a aparecer en el hip-hop, gracias a artistas que las usaban en videoclips y eventos. Hoy en día, han vuelto con fuerza, combinándose con joggers, jeans anchos y zapatillas deportivas para un look retro-futurista.¿Cómo usarlas sin parecer mecánico de carrera?Casual pero con onda: Combínala con jeans y una camiseta básica.Estilo vintage: Unos pantalones cargo y unas sneakers retro serán tu mejor apuesta.Full streetwear: Úsala con joggers, gorra y unas gafas estilo aviador. ¿Dónde conseguirlas?Las marcas de lujo y el fast fashion han adoptado esta tendencia. Puedes encontrarlas en tiendas como INK3D o¿ incluso en tiendas vintage para un toque más auténtico.Las chaquetas de pits han demostrado que no necesitas ser piloto para vestirte como uno. Velocidad, estilo y actitud en una sola prenda. ¿Te unes a la carrera?.',
            image:
              'https://i.pinimg.com/736x/90/ab/b7/90abb79f15ac59502173f0bc5d3663fe.jpg',
            author: 'Emma Blue',
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
