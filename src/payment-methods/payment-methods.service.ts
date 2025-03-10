import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { Order } from 'src/entities/order.entity';
import { Transactions } from 'src/entities/transaction.entity'; // Importamos la entidad de transacciones
import { NodeMailerService } from 'src/nodemailer/nodemailer.service';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentMethodsService {
  private mercadoPagoPreference: Preference;
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Transactions) // Inyectamos el repositorio de transacciones
    private readonly transactionRepository: Repository<Transactions>,
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
      // Generamos la preferencia de pago para MercadoPago
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
            /// APLIQUE CAMBIOS A LA URL ///
            success: 'http://localhost:3001/orders',
            failure: 'http://localhost:3001/orders',
            pending: 'http://localhost:3001/orders',
          },
          auto_return: 'approved',
          notification_url:
            'https://31c3-2802-8010-9419-8801-ed37-b1aa-9984-6452.ngrok-free.app/payment-methods/webhook',
        },
      };

      // Creamos la preferencia en MercadoPago
      const response = await this.mercadoPagoPreference.create(preference);

      // Obtenemos la orden desde la base de datos
      const order = await this.ordersRepository.findOne({
        where: { id: orderId },
        relations: ['user'],
      });

      if (!order || !order.user) {
        throw new BadRequestException('Order or user not found');
      }
      order.status = 'pending';
      order.externalReference = response.id; // Guardamos el preference_id en la base de datos
      await this.ordersRepository.save(order);

      const userEmail = order.user.email;
      await this.nodemailerService.sendEmail(
        userEmail,
        '¡Tu compra ha sido procesada con éxito!',
        `Hola ${order.user.name}, tu compra ha sido confirmada. Orden ID: ${order.id}.`,
      );

      return { payment_url: response.init_point, preference_id: response.id };
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

      if (!paymentId || topic !== 'payment') {
        console.warn('⚠️ Webhook sin ID de pago o no es un evento de pago.');
        return { message: 'Webhook sin datos relevantes' };
      }

      const accessToken = this.configService.get<string>(
        'MERCADOPAGO_ACCESS_TOKEN',
      );

      if (!accessToken) {
        throw new Error(
          'Payment methods service not configured. Please set the MERCADOPAGO_ACCESS_TOKEN environment variable.',
        );
      }

      const mercadoPagoResponse = await axios.get(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      // Retornamos una respuesta indicando que se procesó la notificación
      const paymentStatus = mercadoPagoResponse.data.status;

      const order = await this.ordersRepository.findOne({
        where: { id: mercadoPagoResponse.data.external_reference },
      });

      if (!order) {
        console.warn(`⚠️ Orden con referencia ${paymentId} no encontrada.`);
        return { message: 'Orden no encontrada' };
      }

      // Actualizar el estado de la orden directamente
      if (paymentStatus === 'approved') {
        order.status = 'completed';
      } else if (paymentStatus === 'pending') {
        order.status = 'pending';
      } else if (paymentStatus === 'rejected') {
        order.status = 'failed';
      }

      await this.ordersRepository.save(order);

      // Retornamos una respuesta indicando que se procesó la notificación
      return { message: `Payment ${paymentId} processed` };
    } catch (error) {
      console.error('Payment notification error:', error);
      throw new BadRequestException('Payment notification error');
    }
  }
}
