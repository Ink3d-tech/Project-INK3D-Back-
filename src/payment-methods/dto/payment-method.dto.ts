import { IsString, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class PaymentProductDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  price: number;
}

export class PaymentMethodDto {
  @IsString()
  orderId: string;

  @IsString()
  currency: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentProductDto)
  products: PaymentProductDto[];
}
