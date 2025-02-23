<<<<<<< HEAD
import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
=======
import { IsIn, IsString } from 'class-validator';

export class UpdateOrderDto {
  @IsString()
  @IsIn(['pending', 'shipped', 'delivered', 'cancelled'])
  status: string;
}

export class EditOrderDto {
  products: { productId: string; quantity: number; price: number }[];
}
>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
