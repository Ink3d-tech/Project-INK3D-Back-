import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, IsPositive, IsUUID } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Laptop Gamer', description: 'Nombre único del producto' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Laptop de alta gama para gaming', description: 'Descripción del producto' })
  @IsString()
  description: string;

  @ApiProperty({ example: 1500.99, description: 'Precio del producto' })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 10, description: 'Cantidad de stock disponible' })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 'https://imagen.com/laptop.jpg', description: 'URL de la imagen' })
  @IsString()
  image: string;

  @ApiProperty({ example: 5, description: 'Porcentaje de descuento' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;

  @ApiProperty({ example: 'uuid-de-la-categoria', description: 'ID de la categoría a la que pertenece el producto' })
  @IsUUID()
  categoryId: string;
}
