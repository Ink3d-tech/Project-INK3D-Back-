import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from '../entities/order.entity';
import { User } from '../entities/user.entity';
import { PaymentMethodsService } from '../payment-methods/payment-methods.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, User]), 
    ConfigModule, 

  ],
  controllers: [OrdersController],
  providers: [OrdersService, PaymentMethodsService],
  exports: [OrdersService],
})
export class OrdersModule {}
