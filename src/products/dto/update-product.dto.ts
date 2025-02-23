import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsPositive,
  IsUUID,
  IsEnum,
  Length,
  IsInt,
  IsUrl,
} from 'class-validator';

enum Sizes {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
}

export class UpdateProductDto {
  @ApiProperty({
    example: 'Laptop Gamer',
    description: 'Product name',
    required: false,
  })
  @IsString()
  @Length(1, 255)
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
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({
    example: 10,
    description: 'Available stock',
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  stock?: number;

  @ApiProperty({
    example: 'https://imagen.com/laptop.jpg',
    description: 'Image URL',
    required: false,
  })
  @IsString()
  @IsUrl()
  @Length(1, 500)
  @IsOptional()
  image?: string;

  @ApiProperty({ example: 10, description: 'Discount', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  discount?: number;

  @ApiProperty({
    example: '1fe09b55-d8af-4f82-ac8d-b82489af2d70',
    description: 'Category ID of the product',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  category?: string;

  @ApiProperty({
    example: 'M',
    description: 'Size of the product',
    enum: Sizes,
    required: false,
  })
  @IsEnum(Sizes)
  @IsOptional()
  size?: Sizes;
}
