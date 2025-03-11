// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { StockMovementsController } from './stock-movements.controller';
// import { StockMovementsService } from './stock-movements.service';
// import { StockMovements } from 'src/entities/stock-movement.entiy';
// import { Product } from 'src/entities/product.entity';

// @Module({
//   imports: [TypeOrmModule.forFeature([StockMovements, Product])],
//   controllers: [StockMovementsController],
//   providers: [StockMovementsService],
//   exports: [StockMovementsService], // Para que otros módulos puedan usarlo
// })
// export class StockMovementsModule {}


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockMovementsService } from './stock-movements.service';
import { StockMovementsController } from './stock-movements.controller';
import { Product } from 'src/entities/product.entity';
import { StockMovements } from 'src/entities/stock-movement.entiy';

@Module({
  imports: [TypeOrmModule.forFeature([StockMovements, Product])],
  controllers: [StockMovementsController],
  providers: [StockMovementsService],
  exports: [StockMovementsService],
})
export class StockMovementsModule {}
