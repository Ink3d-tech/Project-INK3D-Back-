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
  products: { id: string; quantity: number}[];

  // @IsNotEmpty()
  // orderDetails: { productId: string; quantity: number; price: number }[];
}
