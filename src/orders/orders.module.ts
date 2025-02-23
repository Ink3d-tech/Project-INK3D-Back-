import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
<<<<<<< HEAD

@Module({
=======
import { Order } from 'src/entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, DataSource])],
>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
