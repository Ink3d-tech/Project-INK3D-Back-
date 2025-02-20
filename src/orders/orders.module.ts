import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { PdfModule } from './pdf/pdf.module';
import { User } from 'src/entities/user.entity';
import { Product } from 'src/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Product]), PdfModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}

