import { IsIn, IsString } from 'class-validator';

export class UpdateOrderDto {
  @IsString()
  @IsIn(['pending', 'shipped', 'delivered', 'cancelled'])
  status: string;
}

export class EditOrderDto {
  products: { productId: string; quantity: number; price: number }[];
}
