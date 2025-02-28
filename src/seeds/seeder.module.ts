import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { Product } from 'src/entities/product.entity';
import { Category } from 'src/entities/category.entity';
import { Order } from 'src/entities/order.entity';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/entities/user.entity';
import { StockMovements } from 'src/entities/stock-movement.entiy';
import { StockMovementsModule } from 'src/stock-movements/stock-movements.module';
import { ProductCombination } from 'src/entities/product-combination.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Category,
      User,
      Order,
      StockMovements,
      ProductCombination,
    ]),
    UsersModule,
    StockMovementsModule,
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
