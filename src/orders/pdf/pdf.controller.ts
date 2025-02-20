import { Controller, Get, Param, Res, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf.service';

@Controller('orders')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get(':id/pdf')
  async getOrderPdf(@Param('id') orderId: string, @Res() res: Response) {
    try {
      const pdfBuffer = await this.pdfService.generateOrderPdf(orderId);
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=order-${orderId}.pdf`,
      });

      res.send(pdfBuffer);
    } catch (error) {
      throw new HttpException('Error generando el PDF', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
