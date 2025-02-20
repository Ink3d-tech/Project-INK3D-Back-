import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';
import { Order } from '../../entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  controllers: [PdfController],
  providers: [PdfService],
})
export class PdfModule {}
