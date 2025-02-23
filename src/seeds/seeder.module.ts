import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { Product } from 'src/entities/product.entity';
import { Category } from 'src/entities/category.entity';
import { Order } from 'src/entities/order.entity';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, User, Order]),
    UsersModule,
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
