import { Module } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { DiscountsController } from './discounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discounts } from 'src/entities/discounts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Discounts])],
  controllers: [DiscountsController],
  providers: [DiscountsService],
})
export class DiscountsModule {}
