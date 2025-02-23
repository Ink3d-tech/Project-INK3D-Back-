<<<<<<< HEAD
export class CreateOrderDto {}
=======
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsArray()
  @IsNotEmpty()
  products: { id: string; quantity: number }[];

  @IsNotEmpty()
  orderDetails: { productId: string; quantity: number; price: number }[];
}
>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
