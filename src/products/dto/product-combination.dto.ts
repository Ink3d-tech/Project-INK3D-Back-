import { IsNotEmpty, IsString, IsInt, Min, IsOptional } from 'class-validator';

export class CreateProductCombinationDto {
  @IsString()
  @IsNotEmpty()
  size: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  stock: number;

  @IsOptional()
  @IsString()
  image?: string;
}
