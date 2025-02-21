import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference } from 'mercadopago';

@Injectable()
export class PaymentMethodsService {
  private mercadoPagoPreference: Preference;

  constructor(private readonly configService: ConfigService) {
    const accessToken = this.configService.get<string>('MERCADOPAGO_ACCESS_TOKEN');

    if (!accessToken) {
      throw new Error('No se encontró MERCADOPAGO_ACCESS_TOKEN en las variables de entorno.');
    }

    const client = new MercadoPagoConfig({ accessToken });

    this.mercadoPagoPreference = new Preference(client);
  }

  async createPayment(
    orderId: string,
    products: { id: string; title: string; price: number; quantity: number }[],
    currency: string
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
            success: this.configService.get<string>('MERCADOPAGO_SUCCESS_URL'),
            failure: this.configService.get<string>('MERCADOPAGO_FAILURE_URL'),
            pending: this.configService.get<string>('MERCADOPAGO_PENDING_URL'),
          },
          auto_return: 'approved',
          notification_url: this.configService.get<string>('MERCADOPAGO_WEBHOOK_URL'),
        },
      };
      const response = await this.mercadoPagoPreference.create(preference);

      return {
        payment_url: response.init_point,
      };
    } catch (error) {
      console.error('Error creando el pago en Mercado Pago:', error);
      throw new Error('No se pudo procesar el pago.');
    }
  }

  async processPaymentNotification(paymentData: any) {
    try {
      console.log('🔔 Notificación recibida de Mercado Pago:', paymentData);

      const paymentId = paymentData.data?.id;
      const topic = paymentData.type || paymentData.topic;

      if (topic === 'payment') {
        console.log(`Procesando pago con ID: ${paymentId}`);


        return { message: `Pago ${paymentId} procesado correctamente` };
      }

      return { message: 'Notificación recibida pero no procesada' };
    } catch (error) {
      console.error('Error procesando la notificación de pago:', error);
      throw new Error('Error procesando la notificación de pago');
    }
  }
}
