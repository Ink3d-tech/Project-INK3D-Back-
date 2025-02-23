<<<<<<< HEAD
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
=======
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
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from '../entities/order.entity';
import {
  ApiBody,
  ApiHideProperty,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

<<<<<<< HEAD
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
=======
  // Endpoint para crear una nueva orden
  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({
    type: CreateOrderDto,
    examples: {
      'order.create': {
        value: {
          userId: '79062eed-7d51-431a-828c-db47feb9e3f7',
          products: [
            {
              id: '79062eed-7d51-431a-828c-db47feb9e3f7',
              quantity: 1,
            },
            {
              id: '79062eed-7d51-431a-828c-db47feb9e3f7',
              quantity: 2,
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    type: Order,
    example: {
      id: '79062eed-7d51-431a-828c-db47feb9e3f7',
      userId: '79062eed-7d51-431a-828c-db47feb9e3f7',
      status: 'pending',
      totalPrice: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
      productDetails: [
        {
          productId: '79062eed-7d51-431a-828c-db47feb9e3f7',
          quantity: 1,
          priceAtPurchase: 10,
        },
        {
          productId: '79062eed-7d51-431a-828c-db47feb9e3f7',
          quantity: 2,
          priceAtPurchase: 10,
        },
      ],
    },
  })
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.addOrder(createOrderDto);
  }

  // Endpoint para obtener todas las órdenes
  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({
    status: 200,
    type: Order,
    isArray: true,
    example: [
      {
        id: '79062eed-7d51-431a-828c-db47feb9e3f7',
        userId: '79062eed-7d51-431a-828c-db47feb9e3f7',
        status: 'pending',
        totalPrice: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
        productDetails: [
          {
            productId: '79062eed-7d51-431a-828c-db47feb9e3f7',
            quantity: 1,
            priceAtPurchase: 10,
          },
          {
            productId: '79062eed-7d51-431a-828c-db47feb9e3f7',
            quantity: 2,
            priceAtPurchase: 10,
          },
        ],
      },
      {
        id: '79062eed-7d51-431a-828c-db47feb9e3f7',
        userId: '79062eed-7d51-431a-828c-db47feb9e3f7',
        status: 'pending',
        totalPrice: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
        productDetails: [
          {
            productId: '79062eed-7d51-431a-828c-db47feb9e3f7',
            quantity: 1,
            priceAtPurchase: 10,
          },
          {
            productId: '79062eed-7d51-431a-828c-db47feb9e3f7',
            quantity: 2,
            priceAtPurchase: 10,
          },
        ],
      },
    ],
  })
  async getAllOrders(): Promise<Order[]> {
    return this.ordersService.getAllOrders();
  }

  // Endpoint para obtener una orden por su ID
  @Get(':id')
  @ApiOperation({ summary: 'Get an order by id' })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    example: '79062eed-7d51-431a-828c-db47feb9e3f7',
  })
  @ApiResponse({
    status: 200,
    type: Order,
    example: {
      id: '79062eed-7d51-431a-828c-db47feb9e3f7',
      userId: '79062eed-7d51-431a-828c-db47feb9e3f7',
      status: 'pending',
      totalPrice: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
      productDetails: [
        {
          productId: '79062eed-7d51-431a-828c-db47feb9e3f7',
          quantity: 1,
          priceAtPurchase: 10,
        },
        {
          productId: '79062eed-7d51-431a-828c-db47feb9e3f7',
          quantity: 2,
          priceAtPurchase: 10,
        },
      ],
    },
  })
  async getOrderById(@Param('id') id: string): Promise<Order> {
    const order = await this.ordersService.getOrderById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found.`);
    }
    return order;
  }

  // Endpoint para actualizar el estado de una orden
  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    example: '79062eed-7d51-431a-828c-db47feb9e3f7',
  })
  @ApiBody({
    type: UpdateOrderDto,
    examples: {
      'order.update': {
        value: {
          status: 'shipped',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    type: Order,
    example: {
      id: '79062eed-7d51-431a-828c-db47feb9e3f7',
      userId: '79062eed-7d51-431a-828c-db47feb9e3f7',
      status: 'shipped',
      totalPrice: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
      productDetails: [
        {
          productId: '79062eed-7d51-431a-828c-db47feb9e3f7',
          quantity: 1,
          priceAtPurchase: 10,
        },
        {
          productId: '79062eed-7d51-431a-828c-db47feb9e3f7',
          quantity: 2,
          priceAtPurchase: 10,
        },
      ],
    },
  })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const order = await this.ordersService.updateOrderStatus(
      id,
      updateOrderDto,
    );
    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada.`);
    }
    return order;
  }

  // Endpoint para cancelar una orden
  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    example: '79062eed-7d51-431a-828c-db47feb9e3f7',
  })
  @ApiResponse({
    status: 200,
    type: Order,
    example: {
      id: '79062eed-7d51-431a-828c-db47feb9e3f7',
      userId: '79062eed-7d51-431a-828c-db47feb9e3f7',
      status: 'cancelled',
      totalPrice: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
      productDetails: [
        {
          productId: '79062eed-7d51-431a-828c-db47feb9e3f7',
          quantity: 1,
          priceAtPurchase: 10,
        },
        {
          productId: '79062eed-7d51-431a-828c-db47feb9e3f7',
          quantity: 2,
          priceAtPurchase: 10,
        },
      ],
    },
  })
  async cancelOrder(@Param('id') id: string): Promise<Order> {
    const order = await this.ordersService.cancelOrder(id);
    if (!order) {
      throw new ForbiddenException('No se puede cancelar la orden.');
    }
    return order;
  }

  // Endpoint para eliminar una orden
  @Delete(':id')
  @ApiHideProperty()
  async deleteOrder(@Param('id') id: string): Promise<Order> {
    const order = await this.ordersService.deleteOrder(id);
    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada.`);
    }
    return order;
>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
  }
}
