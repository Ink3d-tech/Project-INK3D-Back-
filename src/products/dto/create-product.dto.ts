import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Laptop Gamer',
    description: 'Product name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Laptop de alta gama para gaming',
    description: 'Product description',
  })
  @IsString()
  description: string;

  @ApiProperty({ example: 1500.99, description: 'Product price' })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 10, description: 'Available stock' })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({
    example: 'https://imagen.com/laptop.jpg',
    description: 'Image URL',
  })
  @IsString()
  image: string;

  @ApiProperty({ example: 5, description: 'Discount' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;

  @ApiProperty({
    example: '1fe09b55-d8af-4f82-ac8d-b82489af2d70',
    description: 'Category ID of the product',
  })
  @IsUUID()
  categoryId: string;
}
