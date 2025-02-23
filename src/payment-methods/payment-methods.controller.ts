<<<<<<< HEAD
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
=======
import { Controller, Post, Body, Req } from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { Product } from '../entities/product.entity';
import { Request } from 'express';
>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd

@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

<<<<<<< HEAD
  @Post()
  create(@Body() createPaymentMethodDto: CreatePaymentMethodDto) {
    return this.paymentMethodsService.create(createPaymentMethodDto);
  }

  @Get()
  findAll() {
    return this.paymentMethodsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentMethodsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentMethodDto: UpdatePaymentMethodDto) {
    return this.paymentMethodsService.update(+id, updatePaymentMethodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentMethodsService.remove(+id);
=======
  @Post('create')
  createPayment(
    @Body()
    data: {
      orderId: string;
      products: Product[];
      currency: string;
    },
  ) {
    const formattedProducts = data.products.map((product) => ({
      id: product.id,
      title: product.name,
      price: Number(product.price),
      quantity: 1,
    }));

    return this.paymentMethodsService.createPayment(
      data.orderId,
      formattedProducts,
      data.currency,
    );
  }

  @Post('webhook')
  async handleWebhook(@Req() req: Request) {
    try {
      const paymentData = req.body;
      await this.paymentMethodsService.processPaymentNotification(paymentData);
      return { message: 'Webhook recibido correctamente' };
    } catch (error) {
      console.error('Error al procesar el Webhook de Mercado Pago:', error);
      return { message: 'Error procesando el Webhook' };
    }
>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
  }
}
