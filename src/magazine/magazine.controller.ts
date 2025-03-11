import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { MagazineService } from './magazine.service';
import { CreateMagazineDto } from './dto/create-magazine.dto';
import { UpdateMagazineDto } from './dto/update-magazine.dto';
import { Magazine } from '../entities/magazine.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Role } from 'src/roles.enum';
import { AllowOnlyRole } from 'src/decorators/allow-only-role.decorator';

@ApiTags('Magazine')
@Controller('api/magazine')
export class MagazineController {
  constructor(private readonly magazineService: MagazineService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @AllowOnlyRole(Role.Admin)
  @ApiOperation({ summary: 'Crea un nuevo artículo' })
  @ApiResponse({
    status: 201,
    description: 'Artículo creado con éxito',
    type: Magazine,
  })
  create(@Body() createMagazineDto: CreateMagazineDto): Promise<Magazine> {
    return this.magazineService.create(createMagazineDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtiene todos los artículos' })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filtra los artículos por categoría',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de artículos',
    type: [Magazine],
  })
  findAll(@Query('category') category?: string): Promise<Magazine[]> {
    return this.magazineService.findAll(category);
  }

  @Get('active')
  @ApiOperation({ summary: 'Obtiene todos los artículos activos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de artículos activos',
    type: [Magazine],
  })
  findActive(): Promise<Magazine[]> {
    return this.magazineService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un artículo por ID' })
  @ApiResponse({
    status: 200,
    description: 'Artículo encontrado',
    type: Magazine,
  })
  findOne(@Param('id') id: string): Promise<Magazine> {
    return this.magazineService.findOne(id);
  }

  @Get('categories')
@ApiOperation({ summary: 'Obtiene todas las categorías disponibles' })
@ApiResponse({
  status: 200,
  description: 'Lista de categorías',
  type: [String],
})
findAllCategories(): Promise<string[]> {
  return this.magazineService.findAllCategories();
}


  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @AllowOnlyRole(Role.Admin)
  @ApiOperation({ summary: 'Edita un artículo' })
  @ApiBody({
    type: UpdateMagazineDto,
    examples: {
      'user.update': {
        value: {
          title: 'La moda actual en EUROPA',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          image: 'https://imagenssprueba.png',
          author: 'Laura J.',
          category: 'Moda',  // Añadir el ejemplo de category
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Artículo actualizado',
    type: Magazine,
  })
  update(
    @Param('id') id: string,
    @Body() updateMagazineDto: UpdateMagazineDto,
  ): Promise<Magazine> {
    return this.magazineService.update(id, updateMagazineDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @AllowOnlyRole(Role.Admin)
  @ApiOperation({ summary: 'Elimina un artículo' })
  @ApiResponse({ status: 200, description: 'Artículo eliminado' })
  remove(@Param('id') id: string): Promise<void> {
    return this.magazineService.remove(id);
  }

  @Patch('active/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @AllowOnlyRole(Role.Admin)
  @ApiOperation({ summary: 'Activa o desactiva un artículo' })
  @ApiResponse({ status: 200, description: 'Artículo actualizado' })
  toggleActive(@Param('id') id: string): Promise<void> {
    return this.magazineService.toggleActive(id);
  }
}
