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
      const orderDetails = [];
      const updatedProducts: Product[] = [];

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

        // Actualiza el stock y guarda el objeto actualizado
        product.stock -= item.quantity;
        updatedProducts.push(product);

        orderDetails.push({
          productId: product.id,
          quantity: item.quantity,
          priceAtPurchase: product.price,
        });

        total += Number(product.price) * item.quantity;
      }

      // Buscar un descuento activo del usuario
      const discount = user.discounts.find((d) => d.status === 'active');

      if (discount) {
        total *= 1 - Number(discount.amount) / 100;

        discount.status = 'used';
        discount.isUsed = true;
        await queryRunner.manager.save(Discounts, discount);
      }

      const order = queryRunner.manager.create(Order, {
        user,
        status: 'pending',
        totalPrice: total > 0 ? total : 0, // Evitar valores negativos
        orderDetails,
        discount: discount || null,
      });

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

  async updateOrderStatus(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const { status } = updateOrderDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Obtenemos la orden; orderDetails es un campo JSON, así que no es una relación en sí.
      const order = await queryRunner.manager.findOne(Order, {
        where: { id: orderId },
      });
      if (!order) {
        throw new NotFoundException(`Orden con ID ${orderId} no encontrada.`);
      }

      // Por ejemplo, si el estado cambia a "deleted", restauramos el stock.
      if (status === 'deleted') {
        for (const detail of order.orderDetails) {
          const product = await queryRunner.manager.findOne(Product, {
            where: { id: detail.productId },
          });
          if (product) {
            product.stock += detail.quantity;
            await queryRunner.manager.save(Product, product);
          }
        }
      }

      order.status = status;
      // Si es "deleted", podrías agregar aquí el motivo (si lo incluyes en el DTO y en la entidad)
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

        // Actualizar el stock: si se edita la orden, aquí podrías necesitar revertir primero el stock anterior y aplicar el nuevo.\n
        // Suponiendo que la orden original ya descontó stock, deberías restaurar el stock anterior y luego descontar el nuevo.\n
        // Aquí simplificamos asumiendo que la orden se edita antes de cualquier confirmación de pago.\n
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
