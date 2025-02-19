import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, IsPositive } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({ example: 'Laptop Gamer', description: 'Nombre único del producto', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Laptop de alta gama para gaming', description: 'Descripción del producto', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1500.99, description: 'Precio del producto', required: false })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({ example: 10, description: 'Cantidad de stock disponible', required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;
}
