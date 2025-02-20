import { IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  stock: number;

  @IsString()
  image: string;

  @IsUUID()
  categoryId: string; // ✅ Agregamos esta propiedad para enlazar la categoría
}
