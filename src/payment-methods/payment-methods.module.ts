import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethodsController } from './payment-methods.controller';
import { NodemailerModule } from 'src/nodemailer/nodemailer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from 'src/orders/orders.service';
import { Order } from 'src/entities/order.entity';
import { NodeMailerService } from 'src/nodemailer/nodemailer.service';
import { Transactions } from 'src/entities/transaction.entity';

@Module({
  controllers: [PaymentMethodsController],
  imports: [ConfigModule, NodemailerModule, TypeOrmModule.forFeature([Order,Transactions])],
  providers: [PaymentMethodsService, NodeMailerService, OrdersService],
  exports: [PaymentMethodsService],
})
export class PaymentMethodsModule {}
