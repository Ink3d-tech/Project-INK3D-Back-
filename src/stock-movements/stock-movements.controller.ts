// import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
// import { StockMovementsService } from './stock-movements.service';
// import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
// import { ApiBearerAuth } from '@nestjs/swagger';
// import { AuthGuard } from 'src/auth/guards/auth.guard';
// import { RolesGuard } from 'src/auth/guards/roles.guard';
// import { Role } from 'src/roles.enum';
// import { AllowOnlyRole } from 'src/decorators/allow-only-role.decorator';

// @Controller('stock-movements')
// export class StockMovementsController {
//   constructor(private readonly stockMovementsService: StockMovementsService) {}

//   @ApiBearerAuth()
//   @UseGuards(AuthGuard, RolesGuard)
//   @AllowOnlyRole(Role.Admin)
//   @Get()
//   async getAllStockMovements() {
//     return this.stockMovementsService.find();
//   }

//   @ApiBearerAuth()
//   @UseGuards(AuthGuard, RolesGuard)
//   @AllowOnlyRole(Role.Admin)
//   @Get(':productId')
//   async getStockMovements(@Param('productId') productId: string) {
//     return this.stockMovementsService.getStockMovements(productId);
//   }

//   @ApiBearerAuth()
//   @UseGuards(AuthGuard, RolesGuard)
//   @AllowOnlyRole(Role.Admin)
//   @Post()
//   async createStockMovement(@Body() dto: CreateStockMovementDto) {
//     return this.stockMovementsService.createStockMovement(dto);
//   }
// }



import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { StockMovementsService } from './stock-movements.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';

@Controller('stock-movements')
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  // Obtener todos los movimientos de stock
  @Get()
  async findAll() {
    return await this.stockMovementsService.find();
  }

  // Obtener movimientos de stock de un producto específico
  @Get(':productId')
  async getByProduct(@Param('productId') productId: string) {
    return await this.stockMovementsService.getStockMovements(productId);
  }

  // Crear un nuevo movimiento de stock manualmente
  @Post()
  async create(@Body() dto: CreateStockMovementDto) {
    return await this.stockMovementsService.createStockMovement(dto);
  }
}
