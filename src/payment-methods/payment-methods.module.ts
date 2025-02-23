import { Module } from '@nestjs/common';
<<<<<<< HEAD
=======
import { ConfigModule } from '@nestjs/config';
>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethodsController } from './payment-methods.controller';

@Module({
  controllers: [PaymentMethodsController],
<<<<<<< HEAD
  providers: [PaymentMethodsService],
=======
  imports: [ConfigModule],
  providers: [PaymentMethodsService],
  exports: [PaymentMethodsService],
>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
})
export class PaymentMethodsModule {}
