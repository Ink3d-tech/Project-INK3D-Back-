// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { OrdersService } from './orders.service';
// import { CreateOrderDto } from './dto/create-order.dto';
// import { UpdateOrderDto } from './dto/update-order.dto';

// @Controller('orders')
// export class OrdersController {
//   constructor(private readonly ordersService: OrdersService) {}

//   @Post()
//   create(@Body() createOrderDto: CreateOrderDto) {
//     return this.ordersService.create(createOrderDto);
//   }

//   @Get()
//   findAll() {
//     return this.ordersService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.ordersService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
//     return this.ordersService.update(+id, updateOrderDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.ordersService.remove(+id);
//   }
// }


import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      return await this.ordersService.create(createOrderDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    return await this.ordersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.ordersService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return await this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.ordersService.remove(id);
  }
}
