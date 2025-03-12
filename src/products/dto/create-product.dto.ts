import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsPositive,
  IsEnum,
  Length,
  IsInt,
  IsNotEmpty,
} from 'class-validator';

enum Sizes {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
}

export class CreateProductDto {

  @ApiProperty({
    example: 'ASIAN',
    description: 'Product style (e.g., Asian, MotorSport, Formal)',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  style?: string;

  @ApiProperty({ example: 'Camiseta Negra', description: 'Product name' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiProperty({
    example: 'Camiseta negra de algodón 100%',
    description: 'Product description',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 25.99, description: 'Product price' })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @ApiProperty({ example: 50, description: 'Available stock' })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({
    example: 'https://imagen.com/camiseta.jpg',
    description: 'Image URL',
  })
  @IsOptional()
  image: string[];

  @ApiProperty({ example: 5, description: 'Discount' })
  @IsInt()
  @Min(0)
  @IsOptional()
  discount?: number;

  @ApiProperty({
    example: '1fe09b55-d8af-4f82-ac8d-b82489af2d70',
    description: 'Category ID of the product',
  })
  @IsNotEmpty()
  category: { id: string };

  @ApiProperty({
    example: 'M',
    description: 'Size of the product',
    enum: Sizes,
    required: false,
  })
  @IsEnum(Sizes)
  @IsOptional()
  size?: string;
}
