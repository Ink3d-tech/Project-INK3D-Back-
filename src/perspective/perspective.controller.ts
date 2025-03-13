import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AnalyzeResponseDto } from './Dto/respuesta.perspectice';
import { PerspectiveService } from './perspective.service';
import { CreateTextDto } from './Dto/perspective.dto';

@ApiTags('Perspective')
@Controller('perspective')
export class PerspectiveController {
  constructor(private readonly perspectiveService: PerspectiveService) {}

  @ApiOperation({ summary: 'Analizar texto para detectar toxicidad' })
  @ApiResponse({
    status: 200,
    description: 'Análisis completado con éxito',
    type: AnalyzeResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Error al analizar el texto',
  })
  @Post('analyze')
  async analyze(
    @Body() createTextDto: CreateTextDto,
  ): Promise<AnalyzeResponseDto> {
    const result = await this.perspectiveService.analyzeText(
      createTextDto.text,
    );
    return result;
  }
}
