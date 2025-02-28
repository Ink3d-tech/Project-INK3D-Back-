import {
  Injectable,
  // NotFoundException,
  // BadRequestException,
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

  async getStockMovements(productId?: string) {
    const whereCondition = productId
      ? { where: { product: { id: productId } } }
      : {};
    return await this.stockMovementRepository.find({
      relations: ['product'],
      order: { createdAt: 'DESC' },
      ...whereCondition,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async createStockMovement(dto: CreateStockMovementDto) {
    //   const { productId, quantity, type } = dto;
    //   const product = await this.productRepository.findOne({
    //     where: { id: productId },
    //   });
    //   if (!product) {
    //     throw new NotFoundException('Producto no encontrado');
    //   }
    //   // Definir qué tipos de movimiento representan entrada o salida de stock
    //   const incomingTypes = ['purchase', 'manual_adjustment']; // Movimientos que aumentan stock
    //   const outgoingTypes = ['order_creation', 'order_cancellation']; // Movimientos que reducen stock
    //   // Verificar que el stock no se vuelva negativo en movimientos de salida
    //   if (outgoingTypes.includes(type) && product.stock < quantity) {
    //     throw new BadRequestException('Stock insuficiente para esta salida');
    //   }
    //   // Crear movimiento de stock
    //   const stockMovement = this.stockMovementRepository.create({
    //     product,
    //     quantity,
    //     type,
    //   });
    //   await this.stockMovementRepository.save(stockMovement);
    //   // Actualizar stock del producto según el tipo de movimiento
    //   if (incomingTypes.includes(type)) {
    //     product.stock += quantity; // Aumenta stock
    //   } else if (outgoingTypes.includes(type)) {
    //     product.stock -= quantity; // Reduce stock
    //   }
    //   await this.productRepository.save(product);
    //   return stockMovement;
    // }
  }
}
