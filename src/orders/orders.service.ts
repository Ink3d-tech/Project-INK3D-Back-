// import { Injectable } from '@nestjs/common';
// import { CreateOrderDto } from './dto/create-order.dto';
// import { UpdateOrderDto } from './dto/update-order.dto';

// @Injectable()
// export class OrdersService {
//   create(createOrderDto: CreateOrderDto) {
//     return 'This action adds a new order';
//   }

//   findAll() {
//     return `This action returns all orders`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} order`;
//   }

//   update(id: number, updateOrderDto: UpdateOrderDto) {
//     return `This action updates a #${id} order`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} order`;
//   }
// }

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, products, totalPrice, status } = createOrderDto;

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const orderProducts = await Promise.all(
      products.map(async (p) => {
        const product = await this.productRepository.findOne({
          where: { id: p.id },
        });

        if (!product) {
          throw new NotFoundException(`Producto con ID ${p.id} no encontrado`);
        }

        return product;
      }),
    );

    const newOrder = this.orderRepository.create({
      user,
      products: orderProducts,
      totalPrice,
      status,
    });

    return this.orderRepository.save(newOrder);
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['user', 'products'] });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'products'],
    });

    if (!order) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    await this.findOne(id); // Verifica que el pedido exista

    await this.orderRepository.update(id, updateOrderDto);
    return this.findOne(id); // Retorna el pedido actualizado
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Verifica que el pedido exista
    await this.orderRepository.delete(id);
  }
}
