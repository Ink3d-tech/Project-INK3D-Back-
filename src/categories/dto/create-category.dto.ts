import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Remeras', description: 'Nombre de la categoría' })
  @IsString()
  name: string;
}
