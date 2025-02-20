import { IsUUID, IsArray, IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @IsNotEmpty()
  products: { id: string; quantity: number }[];

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;
}
