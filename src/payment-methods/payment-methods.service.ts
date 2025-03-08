import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { Order } from 'src/entities/order.entity';
import { NodeMailerService } from 'src/nodemailer/nodemailer.service';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentMethodsService {
  private mercadoPagoPreference: Preference;
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly configService: ConfigService,
    private nodemailerService: NodeMailerService,
  ) {
    const accessToken = this.configService.get<string>(
      'MERCADOPAGO_ACCESS_TOKEN',
    );
    if (!accessToken) {
      throw new Error(
        'Payment methods service not configured. Please set the MERCADOPAGO_ACCESS_TOKEN environment variable.',
      );
    }
    const client = new MercadoPagoConfig({ accessToken });
    this.mercadoPagoPreference = new Preference(client);
  }
  async createPayment(
    orderId: string,
    products: { id: string; title: string; price: number; quantity: number }[],
    currency: string,
  ) {
    try {
      const preference = {
        body: {
          items: products.map((product) => ({
            id: product.id,
            title: product.title,
            unit_price: product.price,
            quantity: product.quantity,
            currency_id: currency.toUpperCase(),
          })),
          external_reference: orderId,
          back_urls: {
            success: 'https://tu-sitio.com/success',
            failure: 'https://tu-sitio.com/failure',
            pending: 'https://tu-sitio.com/pending',
          },
          auto_return: 'approved',
          notification_url: 'https://tu-sitio.com/api/payment-methods/webhook',
        },
      };
      const response = await this.mercadoPagoPreference.create(preference);
      const order = await this.ordersRepository.findOne({
        where: { id: orderId },
        relations: ['user'], 
      });

      if (!order || !order.user) {
        throw new BadRequestException('Order or user not found');
      }
      const userEmail = order.user.email; 
      await this.nodemailerService.sendEmail(
        userEmail,
        '¡Tu compra ha sido procesada con éxito!',
        `Hola ${order.user.name}, tu compra ha sido confirmada. Orden ID: ${order.id}.`,
      );
      return {
        payment_url: response.init_point,
      };
    } catch (error) {
      console.error(
        'An error occurred while creating the payment in Mercado Pago:',
        error,
      );
      throw new BadRequestException('Unable to create payment in Mercado Pago');
    }
  }
  async processPaymentNotification(paymentData: any) {
    try {
      console.log('Payment notification received:', paymentData);
      const paymentId = paymentData.data?.id;
      const topic = paymentData.type || paymentData.topic;
      if (topic === 'payment') {
        console.log(`Processing payment ${paymentId}`);

        return { message: `Payment ${paymentId} processed` };
      }
      return { message: 'Notification recieved but not processed' };
    } catch (error) {
      console.error('Payment notificarion error:', error);
      throw new BadRequestException('Payment notificarion error');
    }
  }
}







