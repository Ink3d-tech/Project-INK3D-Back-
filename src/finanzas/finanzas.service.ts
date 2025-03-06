import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactions } from 'src/entities/transaction.entity';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';
import { DetailsVenta } from 'src/entities/details-sales.entity';

@Injectable()
export class FinanzasService {
  constructor(
    @InjectRepository(Transactions)
    private transactionRepository: Repository<Transactions>,

    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(DetailsVenta) // Inyectamos el repositorio de DetailsVenta
    private detailsVentaRepository: Repository<DetailsVenta>,
   
  ) {}

  // 🔹 CRUD de Transacciones 🔹
  
  async createTransaction(userId: string, orderId: string, amount: number): Promise<Transactions> {
    const transaction = this.transactionRepository.create({
      user: { id: userId },
      order: { id: orderId },
      amount,
      type: 'payment',
      status: 'completed',
      date: new Date(),
    });
    return await this.transactionRepository.save(transaction);
  }

  async getTransactions(): Promise<Transactions[]> {
    return await this.transactionRepository.find({ relations: ['user', 'order'] });
  }

  async getTransactionById(id: string): Promise<Transactions> {
    return await this.transactionRepository.findOne({ where: { id }, relations: ['user', 'order'] });
  }

  async updateTransactionStatus(id: string, status: 'completed' | 'failed' | 'pending'): Promise<Transactions> {
    await this.transactionRepository.update(id, { status });
    return await this.getTransactionById(id);
  }

  async deleteTransaction(id: string): Promise<void> {
    await this.transactionRepository.delete(id);
  }

  // 🔹 Métodos para Reportes de Ventas 🔹

  async getTotalVentas(): Promise<number> {
    const result = await this.transactionRepository
      .createQueryBuilder('transaction')
      .where("transaction.status = 'completed'")
      .select('SUM(transaction.amount)', 'total')
      .getRawOne();
    return result.total || 0;
  }


  async getProductosVendidosPorCategoria(): Promise<any[]> {
    const logger = new Logger('FinanzasService');
    logger.log('Iniciando la consulta de productos vendidos por categoría...');
  
    try {
      const result = await this.productRepository
        .createQueryBuilder('product')
        .leftJoin('product.category', 'category')
        .leftJoin('product.stockMovements', 'stock')
        .select('category.name', 'categoria')
        .addSelect('SUM(CASE WHEN stock.type = :venta THEN stock.quantity ELSE 0 END)', 'cantidad_vendida')
        .setParameter('venta', 'order_creation')
        .groupBy('category.name')
        .getRawMany();
  
      // Aplicamos el redondeo a 2 decimales para la propiedad 'cantidad_vendida'
      result.forEach(item => {
        item.cantidad_vendida = parseFloat(item.cantidad_vendida);  // Aseguramos que sea un número
        item.cantidad_vendida = item.cantidad_vendida ? parseFloat(item.cantidad_vendida.toFixed(2)) : 0;  // Redondeamos a 2 decimales
      });
  
      logger.log(`Consulta ejecutada exitosamente. Se encontraron ${result.length} categorías.`);
  
      return result;
    } catch (error) {
      logger.error('Error al ejecutar la consulta de productos vendidos por categoría:', error);
      throw error;
    }
  }
  
  
  

  async getTicketPromedio(): Promise<number> {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .where("order.status = 'completed'")
      .select('AVG(order.totalPrice)', 'ticket_promedio')
      .getRawOne();
    return result.ticket_promedio || 0;
  }

  async getProductoMasVendido(): Promise<any> {
    return await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.stockMovements', 'stock')
      .select('product.name', 'producto')
      .addSelect('SUM(ABS(stock.quantity))', 'cantidad_vendida') // Tomamos el valor absoluto
      .where("stock.type = 'order_creation'") // Solo ventas
      .groupBy('product.id')
      .orderBy('cantidad_vendida', 'DESC')
      .limit(1)
      .getRawOne();
  }
  
  async getDetalleVentas(): Promise<any[]> {
    try {
      // Buscamos las órdenes completadas con sus detalles y productos
      const orders = await this.orderRepository.find({
        where: { status: 'completed' },
        relations: ['detailsVenta', 'detailsVenta.product'],
      });
  
      console.log("📦 Órdenes encontradas:", orders);
  
      if (orders.length === 0) {
        console.log("No se encontraron órdenes completadas.");
        return []; // Devuelve un array vacío si no hay órdenes completadas
      }
  
      // Procesamos los detalles de cada venta y calculamos los totales
      const result = orders.map(order => {
        if (order.detailsVenta.length === 0) {
          console.log(`La orden con ID ${order.id} no tiene detalles.`);
          return []; // Si no tiene detalles, devuelve un array vacío para esa orden
        }
  
        // Mapeamos los detalles de venta y calculamos el total
        return order.detailsVenta.map(detail => {
          if (!detail.product) {
            console.log(`El detalle con ID ${detail.id} no tiene un producto asociado.`);
          }
  
          let total = detail.price * detail.quantity;
          total = parseFloat(total.toFixed(2));  // Redondeamos el total a 2 decimales
  
          return {
            venta_id: order.id,
            producto: detail.product ? detail.product.name : 'Producto no encontrado',
            precio: detail.price,
            cantidad: detail.quantity,
            total: total,
          };
        });
      }).flat(); // Usamos `flat()` para aplanar el array de arrays a un solo array
  
      console.log("📊 Resultado:", result);
      return result;
  
    } catch (error) {
      console.error("Error al obtener detalles de ventas:", error);
      throw error;
    }
  }
  
  
  
  
}
