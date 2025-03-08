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
//     return this.stockMovementsService.getStockMovements();
//   }

//   @ApiBearerAuth()
//   @UseGuards(AuthGuard, RolesGuard)
//   @AllowOnlyRole(Role.Admin)
//   @Get(':productId?')
//   async getStockMovements(@Param('productId') productId?: string) {
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


import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { StockMovementsService } from './stock-movements.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/roles.enum';
import { AllowOnlyRole } from 'src/decorators/allow-only-role.decorator';

@Controller('stock-movements')
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AllowOnlyRole(Role.Admin)
  @Get()
  async getAllStockMovements() {
    // Obtener todos los movimientos de stock, incluyendo los productos sin movimientos
    return this.stockMovementsService.getStockMovements();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AllowOnlyRole(Role.Admin)
  @Get(':productId?')
  async getStockMovements(@Param('productId') productId?: string) {
    // Obtener los movimientos de stock para un producto específico, incluyendo productos sin movimientos
    return this.stockMovementsService.getStockMovements(productId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AllowOnlyRole(Role.Admin)
  @Post()
  async createStockMovement(@Body() dto: CreateStockMovementDto) {
    return this.stockMovementsService.createStockMovement(dto);
  }
}
