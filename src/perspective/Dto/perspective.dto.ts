import { ApiProperty } from '@nestjs/swagger';

export class CreateTextDto {
  @ApiProperty({
    description: 'El texto que se va a analizar',
    example: 'Este es un comentario de prueba',
  })
  text: string;
}
