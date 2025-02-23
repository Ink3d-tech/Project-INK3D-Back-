import { Controller, Post, Body, Req } from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { Product } from '../entities/product.entity';
import { Request } from 'express';

@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

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
  }
}
