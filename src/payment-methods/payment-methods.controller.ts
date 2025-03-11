import { Controller, Post, Body, Req } from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { Product } from '../entities/product.entity';
import { Request } from 'express';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { PaymentMethodDto } from './dto/payment-method.dto';

@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Post('create')
  @ApiOperation({ summary: 'Crear un pago' })
  @ApiBody({
    type: PaymentMethodDto,
    description: 'Datos del pago a crear',
    required: true,
    examples: {
      'payment-method.create': {
        value: {
          orderId: 'cdaf3d44-8b81-4b41-8b3a-8c5e171d737c',
          currency: 'ARS',
          products: [
            {
              id: 'a52a1076-e7ff-46af-9e92-c4300a8028bf',
              title: 'Camiseta Negra',
              price: 10,
              quantity: 1,
            },
            {
              id: '4feb09a5-a2c5-4d02-a4b3-d4cc08deb212',
              title: 'Pantalón Jeans Azul',
              price: 20,
              quantity: 2,
            },
          ],
        },
      },
    },
  })
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
      console.log(' Webhook recibido en el backend:', req.body);
      const paymentData = req.body;
      console.log('PAYYMENTADATA', paymentData);
      const res =
        await this.paymentMethodsService.processPaymentNotification(
          paymentData,
        );
      console.log('RESPUESTAAAA', res);
      return { message: 'Webhook recibido correctamente' };
    } catch (error) {
      console.error('Error al procesar el Webhook de Mercado Pago:', error);
      return { message: 'Error procesando el Webhook' };
    }
  }
}
