import * as PDFDocument from 'pdfkit';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../entities/order.entity';

@Injectable()
export class PdfService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async generateOrderPdf(orderId: string): Promise<Buffer> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user', 'products'],
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));

    // 🏷️ Título principal
    doc.fontSize(20).text('INK3D - Detalles del Pedido', { align: 'center' });
    doc.moveDown();

    // 📋 Datos del pedido
    doc.fontSize(12).text(`Pedido ID: ${order.id}`);
    doc.text(`Fecha: ${new Date(order.createdAt).toLocaleString()}`);
    doc.text(`Usuario: ${order.user.name} (${order.user.email})`);
    doc.moveDown();

    // 🛒 Lista de productos
    doc.fontSize(14).text('Productos Comprados', { underline: true });
    doc.moveDown();

    let total = 0;
    order.products.forEach((product, index) => {
      const subtotal = Number(product.price) * 1;
      total += subtotal;

      doc.text(`${index + 1}. ${product.name}`);
      doc.text(`   Precio: $${product.price} x 1 = $${subtotal.toFixed(2)}`);
      doc.moveDown();
    });

    // 🏁 Total del pedido
    doc.moveDown();
    doc.fontSize(14).text(`Total: $${total.toFixed(2)}`, { align: 'right' });

    doc.end();

    return new Promise((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(buffers)));
    });
  }
}
