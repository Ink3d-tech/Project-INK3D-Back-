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
//   async find() {
//     return await this.stockMovementRepository.find({
//       relations: ['product'],
//       order: { createdAt: 'DESC' },
//     });
//   }

//   async getStockMovements(productId: string) {
//     return await this.stockMovementRepository.find({
//       where: { product: { id: productId } },
//       relations: ['product'],
//       order: { createdAt: 'DESC' },
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
//     const incomingTypes = [
//       'supplies_purchase',
//       'manual_add',
//       'order_cancellation',
//     ]; // Movimientos que aumentan stock
//     const outgoingTypes = ['order_creation', 'manual_take']; // Movimientos que reducen stock

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

  // Obtener todos los movimientos de stock
  async find() {
    return await this.stockMovementRepository.find({
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  // Obtener movimientos de un producto específico
  async getStockMovements(productId: string) {
    return await this.stockMovementRepository.find({
      where: { product: { id: productId } },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  // Crear un movimiento de stock
  async createStockMovement(dto: CreateStockMovementDto) {
    const { productId, quantity, type, reason } = dto;
  
    if (quantity <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor a 0');
    }
  
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
  
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
  
    // Obtener el último stock del producto
    const lastStockMovement = await this.stockMovementRepository.findOne({
      where: { product: { id: productId } },
      order: { createdAt: 'DESC' },
    });
  
    const previousStock = lastStockMovement ? lastStockMovement.newStock : 0; // Si no hay previos, empieza en 0
  
    // Definir tipos de movimiento
    const incomingTypes = ['initial_stock', 'supplies_purchase', 'manual_add', 'order_cancellation'];
    const outgoingTypes = ['order_creation', 'manual_take'];
  
    // Verificar que el stock no sea negativo en movimientos de salida
    if (outgoingTypes.includes(type) && product.stock < quantity) {
      throw new BadRequestException('Stock insuficiente para esta salida');
    }
  
    // Calcular el nuevo stock
    let newStock = previousStock;
    if (incomingTypes.includes(type)) {
      newStock += quantity;
    } else if (outgoingTypes.includes(type)) {
      newStock -= quantity;
    }
  
    // Crear y guardar el movimiento de stock
    const stockMovement = this.stockMovementRepository.create({
      product,
      quantity,
      previousStock, 
      newStock, // 🔥 Ahora `newStock` nunca será null
      type,
      reason: reason ?? 'Sin especificar',
    });
  
    await this.stockMovementRepository.save(stockMovement);
  
    // Actualizar el stock en el producto
    product.stock = newStock;
    await this.productRepository.save(product);
  
    return stockMovement;
  }
}  