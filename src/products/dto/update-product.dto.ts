import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsPositive,
<<<<<<< HEAD
} from 'class-validator';

=======
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

>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
export class UpdateProductDto {
  @ApiProperty({
    example: 'Laptop Gamer',
    description: 'Product name',
    required: false,
  })
  @IsString()
<<<<<<< HEAD
=======
  @Length(1, 255)
>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
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
<<<<<<< HEAD
  @IsNumber()
=======
  @IsNumber({ maxDecimalPlaces: 2 })
>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({
    example: 10,
    description: 'Available stock',
    required: false,
  })
<<<<<<< HEAD
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;
=======
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
>>>>>>> 2baa812c150905268d252a5ee328485f5a2e10fd
}
