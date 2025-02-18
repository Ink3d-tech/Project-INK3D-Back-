import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { PaymentMethodsService } from '../payment-methods/payment-methods.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private paymentMethodsService: PaymentMethodsService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { userId, amount } = createOrderDto;

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const order = this.orderRepo.create({
      user,
      status: 'pendiente',
      totalPrice: amount,
    });
    await this.orderRepo.save(order);

    const orderWithProducts = await this.orderRepo.findOne({
      where: { id: order.id },
      relations: ['products'], 
    });

    if (!orderWithProducts || !orderWithProducts.products.length) {
      throw new Error('No hay productos en la orden.');
    }

    const formattedProducts = orderWithProducts.products.map((product) => ({
      id: product.id,
      title: product.name, 
      price: product.price,
      quantity: 1,
    }));

    const currency = 'COP'; 
    const paymentData = await this.paymentMethodsService.createPayment(order.id, formattedProducts, currency);



    return { order, payment_url: paymentData.payment_url };
  }

  async findAll() {
    return await this.orderRepo.find({ relations: ['user', 'products'] });
  }

  async findOne(id: string) {
    const order = await this.orderRepo.findOne({ where: { id }, relations: ['user', 'products'] });
    if (!order) {
      throw new Error(`Orden con ID ${id} no encontrada`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      throw new Error(`Orden con ID ${id} no encontrada`);
    }

    Object.assign(order, updateOrderDto);
    return await this.orderRepo.save(order);
  }

  async remove(id: string) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      throw new Error(`Orden con ID ${id} no encontrada`);
    }

    await this.orderRepo.remove(order);
    return { message: `Orden ${id} eliminada correctamente` };
  }

  async updatePaymentStatus(orderId: string, status: string) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) {
      throw new Error(`Orden con ID ${orderId} no encontrada`);
    }

    order.status = status;
    return await this.orderRepo.save(order);
  }
}
