import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethodsController } from './payment-methods.controller';
import { NodemailerModule } from 'src/nodemailer/nodemailer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from 'src/orders/orders.service';
import { Order } from 'src/entities/order.entity';
import { NodeMailerService } from 'src/nodemailer/nodemailer.service';

@Module({
  controllers: [PaymentMethodsController],
  imports: [ConfigModule, NodemailerModule, TypeOrmModule.forFeature([Order])],
  providers: [PaymentMethodsService, NodeMailerService, OrdersService],
  exports: [PaymentMethodsService],
})
export class PaymentMethodsModule {}
