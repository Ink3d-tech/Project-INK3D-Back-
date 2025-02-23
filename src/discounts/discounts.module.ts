import { Module } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { DiscountsController } from './discounts.controller';
<<<<<<< HEAD

@Module({
=======
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discounts } from 'src/entities/discounts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Discounts])],
>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
  controllers: [DiscountsController],
  providers: [DiscountsService],
})
export class DiscountsModule {}
