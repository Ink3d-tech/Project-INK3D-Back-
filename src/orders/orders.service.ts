import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { EditOrderDto, UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { Discounts } from 'src/entities/discounts.entity';
import { StockMovements } from 'src/entities/stock-movement.entiy';
import { DetailsVenta } from 'src/entities/details-sales.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getAllOrders(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ['user'],
    });
  }

  async getOrderById(id: string): Promise<Order | null> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada.`);
    }

    return order;
  }

  async addOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, products } = createOrderDto;
  
    if (!Array.isArray(products) || products.length < 1) {
      throw new BadRequestException('Cart must contain at least one product.');
    }
  
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        relations: ['discounts'],
      });
  
      if (!user) {
        throw new NotFoundException('User not found.');
      }
  
      let total = 0;
      const updatedProducts: Product[] = [];
      const orderDetailsToSave = [];
  
      for (const item of products) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.id },
        });
  
        if (!product) {
          throw new NotFoundException(`Product with ID ${item.id} not found.`);
        }
        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Product ${product.name} stock is insufficient.`,
          );
        }
  
        // Reducir stock
        product.stock -= item.quantity;
        updatedProducts.push(product);
  
        // Guardar movimiento de stock
        const stockMovement = queryRunner.manager.create(StockMovements, {
          product,
          quantity: -item.quantity,
          type: 'order_creation',
        });
        await queryRunner.manager.save(StockMovements, stockMovement);
  
        total += Number(product.price) * item.quantity;
        console.log("Processing item:", item);
        // Crear detalles de la orden con el precio real de la base de datos
        orderDetailsToSave.push({
          productId: product.id, // Aquí asignamos productId
          quantity: item.quantity,
          price: product.price, // Tomamos el precio de la base de datos
        });
        console.log("Current order details:", orderDetailsToSave);
      }
  
      // Aplicar descuento si existe
      const discount = user.discounts.find((d) => d.status === 'active');
  
      if (discount) {
        total *= 1 - Number(discount.amount) / 100;
        discount.status = 'used';
        discount.isUsed = true;
        await queryRunner.manager.save(Discounts, discount);
      }
  
      // Crear la orden
      const order = queryRunner.manager.create(Order, {
        user,
        status: 'pending',
        totalPrice: total > 0 ? total : 0,
        orderDetails: orderDetailsToSave,
        discount: discount || null,
      });
      await queryRunner.manager.save(Order, order);
  
      // Guardar los detalles de la venta
      const detailsEntities = await Promise.all(
        orderDetailsToSave.map(async (detail) => {
          // Encontrar el producto para asegurarnos de que no sea nulo
          const product = await queryRunner.manager.findOne(Product, { where: { id: detail.productId } });
          if (!product) {
            throw new NotFoundException(`Product with ID ${detail.productId} not found.`);
          }
  
          // Crear y devolver el detalle de la venta
          return queryRunner.manager.create(DetailsVenta, {
            order,
            product,
            quantity: detail.quantity,
            price: detail.price,
          });
        })
      );
  
      // Guardar los detalles de venta
      await queryRunner.manager.save(DetailsVenta, detailsEntities);
      await queryRunner.manager.save(Product, updatedProducts);
  
      // Confirmar la transacción
      await queryRunner.commitTransaction();
      return order;
    } catch (error) {
      // Si ocurre un error, revertimos los cambios realizados en la transacción
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Finalmente, liberamos el queryRunner
      await queryRunner.release();
    }
  }
  
  

  async updateOrderStatus(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const { status } = updateOrderDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.findOne(Order, {
        where: { id: orderId },
      });
      if (!order) {
        throw new NotFoundException(`Orden con ID ${orderId} no encontrada.`);
      }

      if (status === 'deleted') {
        for (const detail of order.orderDetails) {
          const product = await queryRunner.manager.findOne(Product, {
            where: { id: detail.productId },
          });
          if (product) {
            product.stock += detail.quantity;
            await queryRunner.manager.save(Product, product);

            const stockMovement = queryRunner.manager.create(StockMovements, {
              product,
              quantity: detail.quantity,
              type: 'order_cancellation',
            });
            await queryRunner.manager.save(StockMovements, stockMovement);
          }
        }
      }

      order.status = status;
      await queryRunner.manager.save(Order, order);
      await queryRunner.commitTransaction();

      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async cancelOrder(orderId: string): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.findOne(Order, {
        where: { id: orderId },
      });
      if (
        !order ||
        order.status === 'shipped' ||
        order.status === 'delivered'
      ) {
        throw new ForbiddenException(
          'La orden no puede ser cancelada o ya ha sido procesada',
        );
      }

      for (const detail of order.orderDetails) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: detail.productId },
        });
        if (product) {
          product.stock += detail.quantity;
          await queryRunner.manager.save(Product, product);

          const stockMovement = queryRunner.manager.create(StockMovements, {
            product,
            quantity: detail.quantity,
            type: 'order_cancellation',
          });
          await queryRunner.manager.save(StockMovements, stockMovement);
        }
      }

      order.status = 'cancelled';
      await queryRunner.manager.save(Order, order);

      await queryRunner.commitTransaction();
      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async editOrder(orderId: string, editOrderDto: EditOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.findOne(Order, {
        where: { id: orderId },
      });
      if (
        !order ||
        order.status === 'shipped' ||
        order.status === 'delivered'
      ) {
        throw new ForbiddenException(
          'La orden no puede ser editada una vez procesada',
        );
      }

      let totalPrice = 0;
      const orderDetails = [];
      const updatedProducts: Product[] = [];

      for (const item of editOrderDto.products) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.productId },
        });
        if (!product || product.stock < item.quantity) {
          throw new ForbiddenException('Stock insuficiente para el producto');
        }
        totalPrice += product.price * item.quantity;
        orderDetails.push({
          productId: product.id,
          quantity: item.quantity,
          priceAtPurchase: product.price,
        });

        product.stock -= item.quantity;
        updatedProducts.push(product);
      }

      order.orderDetails = orderDetails;
      order.totalPrice = totalPrice;

      await queryRunner.manager.save(Order, order);
      await queryRunner.manager.save(Product, updatedProducts);

      await queryRunner.commitTransaction();
      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteOrder(orderId: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
    });

    if (!order || order.status !== 'pending') {
      throw new ForbiddenException(
        'Solo las órdenes pendientes pueden ser eliminadas',
      );
    }

    order.status = 'deleted';
    return this.ordersRepository.save(order);
  }
}
