import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  Patch,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import { FinanzasService } from './finanzas.service';
import { Transactions } from 'src/entities/transaction.entity';
import { CreateTransactionDto } from './Dto/createTransactionDto';
import { UpdateTransactionDto } from './Dto/updateTransaction';
import { log } from 'node:console';

@ApiTags('Finance')
@Controller('finance')
export class FinanzasController {
  constructor(private readonly financeService: FinanzasService) {}

  @Post('transaction')
  @ApiOperation({ summary: 'Crear una nueva transacción' })
  @ApiResponse({
    status: 201,
    description: 'Transacción creada exitosamente',
    type: Transactions,
  })
  @ApiBody({
    type: CreateTransactionDto,
    description: 'Datos de la transacción a crear',
    examples: {
      example1: {
        value: {
          userId: '123e4567-e89b-12d3-a456-426614174000',
          orderId: '987e6543-b21a-45c7-a321-67890abcdef0',
          amount: 150.75,
        },
      },
    },
  })
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<Transactions> {
    return this.financeService.createTransaction(
      createTransactionDto.userId,
      createTransactionDto.orderId,
      createTransactionDto.amount,
    );
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Obtener todas las transacciones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de transacciones',
    type: [Transactions],
  })
  async getTransactions(): Promise<Transactions[]> {
    return this.financeService.getTransactions();
  }

  @Get('transaction/:id')
  @ApiOperation({ summary: 'Obtener una transacción por ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID de la transacción' })
  @ApiResponse({
    status: 200,
    description: 'Transacción encontrada',
    type: Transactions,
  })
  @ApiResponse({ status: 404, description: 'Transacción no encontrada' })
  async getTransactionById(@Param('id') id: string): Promise<Transactions> {
    return this.financeService.getTransactionById(id);
  }

  @Patch('transaction/:id')
  @ApiOperation({ summary: 'Actualizar el estado de una transacción' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID de la transacción a actualizar',
  })
  @ApiBody({
    type: UpdateTransactionDto,
    description: 'Datos a actualizar en la transacción',
    examples: {
      example1: {
        value: {
          status: 'completed',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Transacción actualizada',
    type: Transactions,
  })
  @ApiResponse({ status: 404, description: 'Transacción no encontrada' })
  async updateTransactionStatus(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transactions> {
    return this.financeService.updateTransactionStatus(
      id,
      updateTransactionDto.status,
    );
  }

  @Delete('transaction/:id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar una transacción' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID de la transacción a eliminar',
  })
  @ApiResponse({
    status: 204,
    description: 'Transacción eliminada exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Transacción no encontrada' })
  async deleteTransaction(@Param('id') id: string): Promise<void> {
    return this.financeService.deleteTransaction(id);
  }

  @Get('/ventas/total')
  @ApiOperation({ summary: 'Obtener el total de todas las ventas' })
  async getTotalVentas() {
    return this.financeService.getTotalVentas();
  }

  @Get('/ventas/productos-vendidos')
  @ApiOperation({
    summary: 'Obtener cantidad de productos vendidos por categoría',
  })
  async getProductosVendidosPorCategoria() {
    return this.financeService.getProductosVendidosPorCategoria();
  }

  @Get('/ventas/ticket-promedio')
  @ApiOperation({ summary: 'Obtener el ticket promedio de ventas' })
  async getTicketPromedio() {
    return this.financeService.getTicketPromedio();
  }

  @Get('/ventas/producto-mas-vendido')
  @ApiOperation({ summary: 'Obtener el producto más vendido' })
  async getProductoMasVendido() {
    return this.financeService.getProductoMasVendido();
  }

  @Get('/ventas/detalle')
  @ApiOperation({ summary: 'Obtener el detalle de todas las ventas' })
  async getDetalleVentas() {
    return this.financeService.getDetalleVentas();
  }
}
