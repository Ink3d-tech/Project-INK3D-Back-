import { PartialType } from '@nestjs/mapped-types';
<<<<<<< HEAD
import { PaymentMethodDto } from './payment-method.dto';

export class UpdatePaymentMethodDto extends PartialType(PaymentMethodDto) {}
=======
import { CreatePaymentMethodDto } from './create-payment-method.dto';

export class UpdatePaymentMethodDto extends PartialType(CreatePaymentMethodDto) {}
>>>>>>> origin/chatbot_h4
