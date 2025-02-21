import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { EditOrderDto, UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    @InjectRepository(User)
    private readonly dataSource: DataSource,
  ) {}

  async getAllOrders(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ['user', 'products'],
    });
  }

  async getOrderById(id: string): Promise<Order | null> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['user', 'products'],
    });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada.`);
    }

    return order;
  }

  async addOrder(createOrderDto: CreateOrderDto) {
    const { userId, products } = createOrderDto;

    if (!Array.isArray(products) || products.length < 1) {
      throw new BadRequestException(
        'El carrito debe contener al menos un producto.',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException(`Usuario no encontrado.`);
      }

      let total = 0;
      const productDetails = [];

      for (const item of products) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.id },
        });

        if (!product) {
          throw new NotFoundException(
            `Producto con ID ${item.id} no encontrado.`,
          );
        }
        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Stock insuficiente para el producto ${product.name}.`,
          );
        }

        product.stock -= item.quantity;
        productDetails.push({
          productId: product.id,
          quantity: item.quantity,
          priceAtPurchase: product.price,
        });

        total += Number(product.price) * item.quantity;
      }

      const order = queryRunner.manager.create(Order, {
        user,
        status: 'pending',
        totalPrice: total,
        productDetails,
      });

      await queryRunner.manager.save(Order, order);
      await queryRunner.manager.save(Product, productDetails);

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
      const order = await queryRunner.manager.findOne(Order, {
        where: { id: orderId },
        relations: ['productDetails'],
      });
      if (!order) {
        throw new NotFoundException(`Orden con ID ${orderId} no encontrada.`);
      }

      if (status === 'cancelled') {
        for (const orderProduct of order.productDetails) {
          const product = await queryRunner.manager.findOne(Product, {
            where: { id: orderProduct.productId },
          });
          if (product) {
            product.stock += orderProduct.quantity;
            await queryRunner.manager.save(Product, product);
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
        relations: ['productDetails'],
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

      for (const productDetail of order.productDetails) {
        const productToUpdate = await queryRunner.manager.findOne(Product, {
          where: { id: productDetail.productId },
        });
        if (productToUpdate) {
          productToUpdate.stock += productDetail.quantity;
          await queryRunner.manager.save(Product, productToUpdate);
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
        relations: ['productDetails'],
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
      const productDetails = [];

      for (const item of editOrderDto.products) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.productId },
        });
        if (!product || product.stock < item.quantity) {
          throw new ForbiddenException('Stock insuficiente para el producto');
        }
        totalPrice += product.price * item.quantity;
        productDetails.push({
          productId: product.id,
          quantity: item.quantity,
          priceAtPurchase: product.price,
        });
      }

      order.productDetails = productDetails;
      order.totalPrice = totalPrice;

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
