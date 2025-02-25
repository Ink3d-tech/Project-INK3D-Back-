import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockMovementsController } from './stock-movements.controller';
import { StockMovementsService } from './stock-movements.service';
import { StockMovements } from 'src/entities/stock-movement.entiy';
import { Product } from 'src/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockMovements, Product])],
  controllers: [StockMovementsController],
  providers: [StockMovementsService],
  exports: [StockMovementsService], // Para que otros módulos puedan usarlo
})
export class StockMovementsModule {}
