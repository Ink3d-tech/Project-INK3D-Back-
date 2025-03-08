// import {
//   Injectable,
//   NotFoundException,
//   BadRequestException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Product } from 'src/entities/product.entity';
// import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
// import { StockMovements } from 'src/entities/stock-movement.entiy';

// @Injectable()
// export class StockMovementsService {
//   constructor(
//     @InjectRepository(StockMovements)
//     private readonly stockMovementRepository: Repository<StockMovements>,
//     @InjectRepository(Product)
//     private readonly productRepository: Repository<Product>,
//   ) {}

//   async getStockMovements(productId?: string) {
//     const whereCondition = productId
//       ? { where: { product: { id: productId } } }
//       : {};
//     return await this.stockMovementRepository.find({
//       relations: ['product'],
//       order: { createdAt: 'DESC' },
//       ...whereCondition,
//     });
//   }

//   async createStockMovement(dto: CreateStockMovementDto) {
//     const { productId, quantity, type } = dto;

//     const product = await this.productRepository.findOne({
//       where: { id: productId },
//     });

//     if (!product) {
//       throw new NotFoundException('Producto no encontrado');
//     }

//     // Definir qué tipos de movimiento representan entrada o salida de stock
//     const incomingTypes = ['purchase', 'manual_adjustment']; // Movimientos que aumentan stock
//     const outgoingTypes = ['order_creation', 'order_cancellation']; // Movimientos que reducen stock

//     // Verificar que el stock no se vuelva negativo en movimientos de salida
//     if (outgoingTypes.includes(type) && product.stock < quantity) {
//       throw new BadRequestException('Stock insuficiente para esta salida');
//     }

//     // Crear movimiento de stock
//     const stockMovement = this.stockMovementRepository.create({
//       product,
//       quantity,
//       type,
//     });

//     await this.stockMovementRepository.save(stockMovement);

//     // Actualizar stock del producto según el tipo de movimiento
//     if (incomingTypes.includes(type)) {
//       product.stock += quantity; // Aumenta stock
//     } else if (outgoingTypes.includes(type)) {
//       product.stock -= quantity; // Reduce stock
//     }

//     await this.productRepository.save(product);

//     return stockMovement;
//   }
// }









// // stock-movements.service.ts

// import {
//   Injectable,
//   NotFoundException,
//   BadRequestException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Product } from 'src/entities/product.entity';
// import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
// import { StockMovements } from 'src/entities/stock-movement.entiy';

// @Injectable()
// export class StockMovementsService {
//   constructor(
//     @InjectRepository(StockMovements)
//     private readonly stockMovementRepository: Repository<StockMovements>,
//     @InjectRepository(Product)
//     private readonly productRepository: Repository<Product>,
//   ) {}

//   async getStockMovements(productId?: string) {
//     const whereCondition = productId
//       ? { where: { product: { id: productId } } }
//       : {};
//     return await this.stockMovementRepository.find({
//       relations: ['product'],
//       order: { createdAt: 'DESC' },
//       ...whereCondition,
//     });
//   }

//   async createStockMovement(dto: CreateStockMovementDto) {
//     const { productId, quantity, type, size } = dto;

//     const product = await this.productRepository.findOne({
//       where: { id: productId },
//     });

//     if (!product) {
//       throw new NotFoundException('Producto no encontrado');
//     }

//     // Definir qué tipos de movimiento representan entrada o salida de stock
//     const incomingTypes = ['purchase', 'manual_adjustment']; // Movimientos que aumentan stock
//     const outgoingTypes = ['order_creation', 'order_cancellation']; // Movimientos que reducen stock

//     // Verificar que el stock por talla no se vuelva negativo en movimientos de salida
//     // Utilizamos un método para simular el stock de talla
//     const stockBySize = await this.getStockForSize(productId, size);

//     if (outgoingTypes.includes(type) && stockBySize < quantity) {
//       throw new BadRequestException('Stock insuficiente para esta salida');
//     }

//     // Crear movimiento de stock
//     const stockMovement = this.stockMovementRepository.create({
//       product,
//       quantity,
//       type,
//       size,
//       createdAt: new Date(),
//     });

//     await this.stockMovementRepository.save(stockMovement);

//     // Actualizar stock del producto según el tipo de movimiento y talla
//     if (incomingTypes.includes(type)) {
//       await this.updateStockForSize(productId, size, quantity, 'increase');
//     } else if (outgoingTypes.includes(type)) {
//       await this.updateStockForSize(productId, size, quantity, 'decrease');
//     }

//     return stockMovement;
//   }

//   // Método para obtener el stock actual de la talla
//   private async getStockForSize(productId: string, size: string): Promise<number> {
//     const movements = await this.stockMovementRepository.find({
//       where: { product: { id: productId }, size },
//     });

//     let stock = 0;
//     movements.forEach((movement) => {
//       if (movement.type === 'purchase' || movement.type === 'manual_adjustment') {
//         stock += movement.quantity;
//       } else if (movement.type === 'order_creation' || movement.type === 'order_cancellation') {
//         stock -= movement.quantity;
//       }
//     });
//     return stock;
//   }

//   // Método para actualizar el stock de la talla
//   private async updateStockForSize(
//     productId: string,
//     size: string,
//     quantity: number,
//     operation: 'increase' | 'decrease',
//   ) {
//     const stockMovement = await this.stockMovementRepository.findOne({
//       where: { product: { id: productId }, size },
//     });

//     // Simulamos el stock de cada talla con los movimientos previos
//     let currentStock = await this.getStockForSize(productId, size);

//     if (operation === 'increase') {
//       currentStock += quantity;
//     } else if (operation === 'decrease') {
//       currentStock -= quantity;
//     }

//     // Aquí puedes guardar o actualizar los datos de stock de talla
//     // Si decides no almacenar el stock por talla directamente en Product, puedes almacenar en la base de datos los movimientos relacionados con la talla.
//   }
// }






// stock-movements.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { StockMovements } from 'src/entities/stock-movement.entiy';

@Injectable()
export class StockMovementsService {
  constructor(
    @InjectRepository(StockMovements)
    private readonly stockMovementRepository: Repository<StockMovements>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Obtener todos los movimientos de stock, incluyendo los productos sin movimientos
  async getStockMovements(productId?: string) {
    const whereCondition = productId ? { where: { product: { id: productId } } } : {};

    // Obtener todos los movimientos de stock
    const stockMovements = await this.stockMovementRepository.find({
      relations: ['product'],
      order: { createdAt: 'DESC' },
      ...whereCondition,
    });

    // Obtener todos los productos (incluso los que no tienen movimientos)
    const products = await this.productRepository.find();

    // Agregar productos sin movimientos
    const productsWithMovements = products.map((product) => {
      const movements = stockMovements.filter(
        (movement) => movement.product.id === product.id
      );

      if (movements.length === 0) {
        // Si el producto no tiene movimientos, devolver un "movimiento vacío"
        return {
          product,
          quantity: 0,
          type: 'none', // O cualquier tipo que represente "sin movimiento"
          createdAt: new Date(),
        };
      }

      return movements[0]; // Devolver el primer movimiento, en caso de que tenga
    });

    return productsWithMovements;
  }

  // Método para crear un nuevo movimiento de stock
  async createStockMovement(dto: CreateStockMovementDto) {
    const { productId, quantity, type, size } = dto;

    // Verificar si el producto existe
    const product = await this.productRepository.findOne({ where: { id: productId } });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    // Definir tipos de movimiento que son de entrada y salida
    const incomingTypes = ['purchase', 'manual_adjustment']; // Movimientos que aumentan stock
    const outgoingTypes = ['order_creation', 'order_cancellation']; // Movimientos que reducen stock

    // Verificar que haya suficiente stock para los movimientos de salida
    const stockBySize = await this.getStockForSize(productId, size);

    if (outgoingTypes.includes(type) && stockBySize < quantity) {
      throw new BadRequestException('Stock insuficiente para esta salida');
    }

    // Crear el movimiento de stock
    const stockMovement = this.stockMovementRepository.create({
      product,
      quantity,
      type,
      size,
      createdAt: new Date(),
    });

    // Guardar el movimiento de stock
    await this.stockMovementRepository.save(stockMovement);

    // Actualizar el stock de acuerdo al tipo de movimiento
    if (incomingTypes.includes(type)) {
      await this.updateStockForSize(productId, size, quantity, 'increase');
    } else if (outgoingTypes.includes(type)) {
      await this.updateStockForSize(productId, size, quantity, 'decrease');
    }

    return stockMovement;
  }

  // Método para obtener el stock actual de una talla de producto
  private async getStockForSize(productId: string, size: string): Promise<number> {
    const movements = await this.stockMovementRepository.find({
      where: { product: { id: productId }, size },
    });

    let stock = 0;
    movements.forEach((movement) => {
      if (movement.type === 'purchase' || movement.type === 'manual_adjustment') {
        stock += movement.quantity;
      } else if (movement.type === 'order_creation' || movement.type === 'order_cancellation') {
        stock -= movement.quantity;
      }
    });

    return stock;
  }

  // Método para actualizar el stock de una talla de producto
  private async updateStockForSize(
    productId: string,
    size: string,
    quantity: number,
    operation: 'increase' | 'decrease',
  ) {
    // Obtener el stock actual por tamaño
    let currentStock = await this.getStockForSize(productId, size);

    // Actualizar el stock según el tipo de operación (aumento o disminución)
    if (operation === 'increase') {
      currentStock += quantity;
    } else if (operation === 'decrease') {
      currentStock -= quantity;
    }

    // Aquí puedes actualizar el stock en la base de datos, si es necesario
    // Esta función solo simula el cambio, no guarda nada en la base de datos por sí sola
  }
}
