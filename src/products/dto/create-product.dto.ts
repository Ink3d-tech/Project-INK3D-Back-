import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsPositive,
<<<<<<< HEAD
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
=======
  IsEnum,
  Length,
  IsInt,
  IsUrl,
  IsNotEmpty,
} from 'class-validator';
import { Category } from 'src/entities/category.entity';

enum Sizes {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
}

export class CreateProductDto {
  @ApiProperty({ example: 'Camiseta Negra', description: 'Product name' })
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiProperty({
    example: 'Camiseta negra de algodón 100%',
>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
    description: 'Product description',
  })
  @IsString()
  description: string;

<<<<<<< HEAD
  @ApiProperty({ example: 1500.99, description: 'Product price' })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 10, description: 'Available stock' })
  @IsNumber()
=======
  @ApiProperty({ example: 25.99, description: 'Product price' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @ApiProperty({ example: 50, description: 'Available stock' })
  @IsInt()
>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
  @Min(0)
  stock: number;

  @ApiProperty({
<<<<<<< HEAD
    example: 'https://imagen.com/laptop.jpg',
    description: 'Image URL',
  })
  @IsString()
  image: string;

  @ApiProperty({ example: 5, description: 'Discount' })
  @IsNumber()
=======
    example: 'https://imagen.com/camiseta.jpg',
    description: 'Image URL',
  })
  @IsString()
  @IsUrl()
  @Length(1, 500)
  image: string;

  @ApiProperty({ example: 5, description: 'Discount' })
  @IsInt()
>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
  @Min(0)
  @IsOptional()
  discount?: number;

  @ApiProperty({
    example: '1fe09b55-d8af-4f82-ac8d-b82489af2d70',
    description: 'Category ID of the product',
  })
<<<<<<< HEAD
  @IsUUID()
  categoryId: string;
=======
  @IsNotEmpty()
  category: Category;

  @ApiProperty({
    example: 'M',
    description: 'Size of the product',
    enum: Sizes,
    required: false,
  })
  @IsEnum(Sizes)
  @IsOptional()
  size?: string;
>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
}
