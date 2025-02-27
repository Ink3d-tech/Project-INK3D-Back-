import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { StockMovementsService } from './stock-movements.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AllowOnlyRole } from 'src/decorators/allow-only-role.decorator';
import { Role } from 'src/roles.enum';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Stock Movements')
@Controller('stock-movements')
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AllowOnlyRole(Role.Admin)
  @ApiOperation({ summary: 'Get all stock movements (Admin only)' })
  async getAllStockMovements() {
    return this.stockMovementsService.getStockMovements();
  }

  @Get(':productId?')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AllowOnlyRole(Role.Admin)
  @ApiOperation({ summary: 'Get stock movements by product ID (Admin only)' })
  async getStockMovements(@Param('productId') productId?: string) {
    return this.stockMovementsService.getStockMovements(productId);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AllowOnlyRole(Role.Admin)
  @ApiOperation({ summary: 'Create a stock movement (Admin only)' })
  async createStockMovement(@Body() dto: CreateStockMovementDto) {
    return this.stockMovementsService.createStockMovement(dto);
  }
}
