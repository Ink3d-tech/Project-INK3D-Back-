import { ApiProperty } from '@nestjs/swagger';

export class AnalyzeResponseDto {
  @ApiProperty({
    description: 'Puntuación de toxicidad',
    example: {
      attributeScores: {
        TOXICITY: {
          value: 0.85,
        },
      },
    },
  })
  attributeScores: any;

  @ApiProperty({
    description: 'Mensaje textual que indica si el comentario es tóxico',
    example: 'Este comentario es tóxico.',
  })
  toxicityMessage: string;

  @ApiProperty({
    description: 'Idioma del texto analizado',
    example: ['es'],
  })
  languages: string[];

  @ApiProperty({
    description: 'Idiomas detectados en el comentario',
    example: ['es'],
  })
  detectedLanguages: string[];
}
