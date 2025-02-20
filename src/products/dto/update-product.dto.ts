import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsPositive,
} from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({
    example: 'Laptop Gamer',
    description: 'Product name',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Laptop de alta gama para gaming',
    description: 'Product description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 1500.99,
    description: 'Product price',
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({
    example: 10,
    description: 'Available stock',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;
}
