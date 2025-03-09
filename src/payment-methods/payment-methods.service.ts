// import { BadRequestException, Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { InjectRepository } from '@nestjs/typeorm';
// import { MercadoPagoConfig, Preference } from 'mercadopago';
// import { Order } from 'src/entities/order.entity';
// import { Transactions } from 'src/entities/transaction.entity'; // Importamos la entidad de transacciones
// import { NodeMailerService } from 'src/nodemailer/nodemailer.service';
// import { Repository } from 'typeorm';

// @Injectable()
// export class PaymentMethodsService {
//   private mercadoPagoPreference: Preference;
//   constructor(
//     @InjectRepository(Order)
//     private readonly ordersRepository: Repository<Order>,
//     @InjectRepository(Transactions) // Inyectamos el repositorio de transacciones
//     private readonly transactionRepository: Repository<Transactions>,
//     private readonly configService: ConfigService,
//     private nodemailerService: NodeMailerService,
//   ) {
//     const accessToken = this.configService.get<string>(
//       'MERCADOPAGO_ACCESS_TOKEN',
//     );
//     if (!accessToken) {
//       throw new Error(
//         'Payment methods service not configured. Please set the MERCADOPAGO_ACCESS_TOKEN environment variable.',
//       );
//     }
//     const client = new MercadoPagoConfig({ accessToken });
//     this.mercadoPagoPreference = new Preference(client);
//   }
//   async createPayment(
//     orderId: string,
//     products: { id: string; title: string; price: number; quantity: number }[],
//     currency: string,
//   ) {
//     try {
//       // Generamos la preferencia de pago para MercadoPago
//       const preference = {
//         body: {
//           items: products.map((product) => ({
//             id: product.id,
//             title: product.title,
//             unit_price: product.price,
//             quantity: product.quantity,
//             currency_id: currency.toUpperCase(),
//           })),
//           external_reference: orderId,
//           back_urls: {
//             /// APLIQUE CAMBIOS A LA URL ///
//             success: 'http://localhost:3001/orders',
//             failure: 'http://localhost:3001/orders',
//             pending: 'http://localhost:3001/orders',
//           },
//           auto_return: 'approved',
//           notification_url: 'https://project-ink3d-back-1.onrender.com/api/payment-methods/webhook',
//         },       
//       };

//       // Creamos la preferencia en MercadoPago
//       const response = await this.mercadoPagoPreference.create(preference);

//       // Obtenemos la orden desde la base de datos
//       const order = await this.ordersRepository.findOne({
//         where: { id: orderId },
//         relations: ['user'],
//       });

//       if (!order || !order.user) {
//         throw new BadRequestException('Order or user not found');
//       }

//       // Creamos una transacción asociada a la orden
//       const transaction = this.transactionRepository.create({
//         order: { id: orderId },
//         user: { id: order.user.id },
//         amount: order.totalPrice,
//         type: 'payment',
//         status: 'pending', // Inicialmente está pendiente
//         date: new Date(),
//       });

//       await this.transactionRepository.save(transaction);

//       // Enviar correo de confirmación
//       const userEmail = order.user.email;
//       await this.nodemailerService.sendEmail(
//         userEmail,
//         '¡Tu compra ha sido procesada con éxito!',
//         `Hola ${order.user.name}, tu compra ha sido confirmada. Orden ID: ${order.id}.`,
//       );
//       return {
//         payment_url: response.init_point, // URL para redirigir al cliente a la pasarela de pago
//       };
//     } catch (error) {
//       console.error(
//         'An error occurred while creating the payment in Mercado Pago:',
//         error,
//       );
//       throw new BadRequestException('Unable to create payment in Mercado Pago');
//     }
//   }
//   async processPaymentNotification(paymentData: any) {
//     try {
//       console.log('Payment notification received:', paymentData);
//       const paymentId = paymentData.data?.id;
//       const topic = paymentData.type || paymentData.topic;
//       if (topic === 'payment') {
//         console.log(`Processing payment ${paymentId}`);

//         // Recuperamos la transacción asociada
//         const transaction = await this.transactionRepository.findOne({
//           where: { externalReference: paymentId },
//         });

//         if (!transaction) {
//           throw new BadRequestException('Transaction not found');
//         }

//         // Actualizamos el estado de la transacción dependiendo de la respuesta de MercadoPago
//         if (paymentData.status === 'approved') {
//           transaction.status = 'completed';
//         } else if (paymentData.status === 'pending') {
//           transaction.status = 'pending';
//         } else if (paymentData.status === 'rejected') {
//           transaction.status = 'failed';
//         }

//         // Guardamos la transacción actualizada
//         await this.transactionRepository.save(transaction);

//         // Retornamos una respuesta indicando que se procesó la notificación
//         return { message: `Payment ${paymentId} processed` };
//       }

//       return { message: 'Notification received but not processed' };
//     } catch (error) {
//       console.error('Payment notification error:', error);
//       throw new BadRequestException('Payment notification error');
//     }

//   }

//   async getPaymentStatus(paymentId: string) {
//     const transaction = await this.transactionRepository.findOne({
//       where: { externalReference: paymentId },
//     });

//     console.log('================/ TRANSACTION /====================');
//     console.log('Transaction:', transaction);
//     console.log('====================================');

//     if (!transaction) {
//       throw new BadRequestException('Transaction not found');
//     }

//     return { status: transaction.status };
// }
// }

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
      'MP_ACCESS_TOKEN',
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
            success: 'https://5b72-186-134-31-0.ngrok-free.app/payment-methods/orders',
            failure: 'https://tu-sitio.com/failure',
            pending: 'https://tu-sitio.com/pending',
          },
          auto_return: 'approved',
          notification_url: 'https://5b72-186-134-31-0.ngrok-free.app/payment-methods/webhook',
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

      // Creamos una transacción asociada a la orden
      const transaction = this.transactionRepository.create({
        order: { id: orderId },
        user: { id: order.user.id },
        amount: order.totalPrice,
        type: 'payment',
        status: 'pending', // Inicialmente está pendiente
        date: new Date(),
      });

      await this.transactionRepository.save(transaction);

      // Enviar correo de confirmación
      const userEmail = order.user.email;
      await this.nodemailerService.sendEmail(
        userEmail,
        '¡Tu compra ha sido procesada con éxito!',
        `Hola ${order.user.name}, tu compra ha sido confirmada. Orden ID: ${order.id}.`,
      );
      return {
        payment_url: response.init_point, // URL para redirigir al cliente a la pasarela de pago
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
      console.log('📩 Payment notification received:', paymentData);

      const paymentId = paymentData.data?.id;
      const topic = paymentData.type || paymentData.topic;

      if (!paymentId || topic !== 'payment') {
        console.warn('⚠️ Webhook sin ID de pago o no es un evento de pago.');
        return { message: 'Webhook sin datos relevantes' };
      }

      console.log(`🔍 Consultando estado del pago ${paymentId} en MercadoPago...`);

      // Hacer una solicitud a MercadoPago para obtener el estado real del pago
      const mercadoPagoResponse = await axios.get(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        },
      );

      const paymentStatus = mercadoPagoResponse.data.status;

      console.log(`✅ Estado del pago: ${paymentStatus}`);

      // Buscar la transacción en la base de datos
      const transaction = await this.transactionRepository.findOne({
        where: { externalReference: paymentId },
      });

      if (!transaction) {
        console.warn(`⚠️ Transacción con referencia ${paymentId} no encontrada.`);
        return { message: 'Transacción no encontrada' };
      }

      // Actualizar estado según la respuesta de MercadoPago
      if (paymentStatus === 'approved') {
        transaction.status = 'completed';
      } else if (paymentStatus === 'pending') {
        transaction.status = 'pending';
      } else if (paymentStatus === 'rejected') {
        transaction.status = 'failed';
      }

      // Guardar la transacción actualizada
      await this.transactionRepository.save(transaction);

      console.log(`✅ Transacción ${paymentId} actualizada a estado: ${transaction.status}`);

      return { message: `Pago ${paymentId} procesado correctamente` };
    } catch (error) {
      console.error('❌ Error al procesar la notificación de pago:', error.response?.data || error);
      throw new BadRequestException('Error procesando la notificación de pago');
    }

  }

  async getPaymentStatus(paymentId: string) {
    const order = await this.ordersRepository.findOne({
      where: { id: paymentId },
      // relations: ['transactions'],
    });

    const transaction = await this.transactionRepository.findOne({
      where: { order: order.transactions },
    });

    console.log('================/ TRANSACTION /====================');
    console.log('Transaction:', transaction);
    console.log('====================================');

    if (!transaction) {
      throw new BadRequestException('Transaction not found');
    }

    return { status: transaction.status };
  }
}














