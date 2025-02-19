import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Remeras', description: 'Nombre de la categoría' })
  @IsString()
  name: string;
}

export class UpdateCategoryDto {
  @ApiProperty({
    example: 'Nuevas Remeras',
    description: 'Nuevo nombre de la categoría',
  })
  @IsString()
  name: string;
}
