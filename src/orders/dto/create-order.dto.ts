import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

  @IsArray()
  @IsNotEmpty()
  orderDetails: { productId: string; quantity: number; price: number }[];

  // Campo opcional para enviar el código de descuento desde el front
  @IsOptional()
  @IsString()
  discountCode?: string;
}
