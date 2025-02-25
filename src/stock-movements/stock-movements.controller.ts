import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { StockMovementsService } from './stock-movements.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';

@Controller('stock-movements')
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  @Get()
  async getAllStockMovements() {
    return this.stockMovementsService.getStockMovements();
  }

  @Get(':productId?')
  async getStockMovements(@Param('productId') productId?: string) {
    return this.stockMovementsService.getStockMovements(productId);
  }

  @Post()
  async createStockMovement(@Body() dto: CreateStockMovementDto) {
    return this.stockMovementsService.createStockMovement(dto);
  }
}
