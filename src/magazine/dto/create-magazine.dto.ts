import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMagazineDto {
  @ApiProperty({ example: 'Moda' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 'La moda actual en Asia' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 'https://imagenssprueba.png' })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({ example: 'Camilo C' })
  @IsString()
  @IsNotEmpty()
  author: string;
}
