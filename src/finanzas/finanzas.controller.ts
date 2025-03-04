// src/finance/finance.controller.ts
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

@ApiTags('Finance') // Agrupa los endpoints en la documentación de Swagger
@Controller('finance')
export class FinanzasController {
  constructor(private readonly financeService: FinanzasService) {}

  /**
   * 📌 Crear una transacción
   *
   * @param createTransactionDto Datos necesarios para crear una transacción
   * @returns La transacción creada
   */
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
  })
  async createTransaction(
    @Body('userId') id: string,
    @Body('orderId') order: string,
    @Body('amount') amount: string,
  ): Promise<Transactions> {
    return this.financeService.createTransaction(id, order, parseInt(amount));
  }

  /**
   * 📌 Obtener todas las transacciones
   *
   * @returns Lista de todas las transacciones
   */
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

  /**
   * 📌 Obtener una transacción específica por ID
   *
   * @param id Identificador de la transacción
   * @returns La transacción correspondiente
   */
  @Get('transaction/:id')
  @ApiOperation({ summary: 'Obtener una transacción por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la transacción' })
  @ApiResponse({
    status: 200,
    description: 'Transacción encontrada',
    type: Transactions,
  })
  @ApiResponse({ status: 404, description: 'Transacción no encontrada' })
  async getTransactionById(@Param('id') id: string): Promise<Transactions> {
    return this.financeService.getTransactionById(id);
  }

  /**
   * 📌 Actualizar el estado de una transacción
   *
   * @param id Identificador de la transacción
   * @param updateTransactionDto Datos de la transacción a actualizar
   * @returns La transacción actualizada
   */
  @Patch('transaction/:id')
  @ApiOperation({ summary: 'Actualizar el estado de una transacción' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la transacción a actualizar',
  })
  @ApiBody({
    type: UpdateTransactionDto,
    description: 'Datos a actualizar en la transacción',
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

  /**
   * 📌 Eliminar una transacción
   *
   * @param id Identificador de la transacción
   * @returns Respuesta sin contenido si la eliminación fue exitosa
   */
  @Delete('transaction/:id')
  @HttpCode(204) // Código de respuesta 204 (No Content)
  @ApiOperation({ summary: 'Eliminar una transacción' })
  @ApiParam({
    name: 'id',
    type: Number,
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
  @ApiOperation({ summary: 'Obtener cantidad de productos vendidos por categoría' })
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

