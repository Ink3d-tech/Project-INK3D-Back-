import { PartialType } from '@nestjs/mapped-types';
import { PaymentMethodDto } from './payment-method.dto';

export class UpdatePaymentMethodDto extends PartialType(PaymentMethodDto) {}
