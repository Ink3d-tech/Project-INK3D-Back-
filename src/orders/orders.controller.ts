import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Delete,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from '../entities/order.entity';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, type: Order })
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    if (!createOrderDto.userId || !createOrderDto.products?.length) {
      throw new BadRequestException('Invalid order data');
    }
    return this.ordersService.addOrder(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, type: [Order] })
  async getAllOrders(): Promise<Order[]> {
    return this.ordersService.getAllOrders();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @ApiResponse({ status: 200, type: Order })
  async getOrderById(@Param('id') id: string): Promise<Order> {
    const order = await this.ordersService.getOrderById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found.`);
    }
    return order;
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({ status: 200, type: Order })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    if (!updateOrderDto.status) {
      throw new BadRequestException('Status is required');
    }
    const order = await this.ordersService.updateOrderStatus(id, updateOrderDto);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found.`);
    }
    return order;
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @ApiResponse({ status: 200, type: Order })
  async cancelOrder(@Param('id') id: string): Promise<Order> {
    const order = await this.ordersService.cancelOrder(id);
    if (!order) {
      throw new ForbiddenException('Order cannot be canceled.');
    }
    return order;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @ApiResponse({ status: 200, type: Order })
  async deleteOrder(@Param('id') id: string): Promise<Order> {
    const order = await this.ordersService.deleteOrder(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found.`);
    }
    return order;
  }
}
