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
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from '../entities/order.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHideProperty,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/roles.enum';
import { AllowOnlyRole } from 'src/decorators/allow-only-role.decorator';
import { AllowOwnerOrRole } from 'src/decorators/allow-owner-or-role.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AllowOwnerOrRole(Role.Admin)
  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({
    type: CreateOrderDto,
    examples: {
      'order.create': {
        value: {
          userId: '474d16b7-9e50-447b-9702-7a58d25e8196',
          discountCode: 'c6b7f845-d2ea-4a06-8f8b-28d18f48abb3',
          products: [
            {
              id: 'b8e0e24d-d2d5-47c8-b454-bd3baf25af21',
              quantity: 1,
            },
            {
              id: 'b4234348-2fb8-45dd-951e-bd9d6d74c20b',
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

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AllowOnlyRole(Role.Admin)
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

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AllowOwnerOrRole(Role.Admin)
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

  // @ApiBearerAuth()
  // @UseGuards(AuthGuard, RolesGuard)
  // @AllowOnlyRole(Role.Admin)
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

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AllowOwnerOrRole(Role.Admin)
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

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AllowOnlyRole(Role.Admin)
  @Delete(':id')
  @ApiHideProperty()
  async deleteOrder(@Param('id') id: string): Promise<Order> {
    const order =  this.ordersService.deleteOrder(id);
    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada.`);
    }
    return order;
  }
}
