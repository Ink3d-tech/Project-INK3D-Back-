import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MagazineService } from './magazine.service';
import { CreateMagazineDto } from './dto/create-magazine.dto';
import { UpdateMagazineDto } from './dto/update-magazine.dto';
import { Magazine } from '../entities/magazine.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { AllowOnlyRole } from 'src/decorators/allow-only-role.decorator';
import { Role } from 'src/roles.enum';




@ApiTags('Magazine')

@Controller('api/magazine')
@UseGuards(AuthGuard('jwt'), RolesGuard) // Se aplica a todas las rutas del controlador
export class MagazineController {
  constructor(private readonly magazineService: MagazineService) {}

  @Post()
  @AllowOnlyRole(Role.Admin)
  @ApiOperation({ summary: 'Crea un nuevo artículo' })
  @ApiResponse({ status: 201, description: 'Artículo creado con éxito', type: Magazine })
  create(@Body() createMagazineDto: CreateMagazineDto): Promise<Magazine> {
    return this.magazineService.create(createMagazineDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
 
  @ApiOperation({ summary: 'Obtiene todos los artículos' })
  @ApiResponse({ status: 200, description: 'Lista de artículos', type: [Magazine] })
  findAll(): Promise<Magazine[]> {
    return this.magazineService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un artículo por ID' })
  @ApiResponse({ status: 200, description: 'Artículo encontrado', type: Magazine })
  findOne(@Param('id') id: number): Promise<Magazine> {
    return this.magazineService.findOne(id);
  }

  @Put(':id')
  @AllowOnlyRole(Role.Admin)
  @ApiOperation({ summary: 'Edita un artículo' })
  @ApiResponse({ status: 200, description: 'Artículo actualizado', type: Magazine })
  update(@Param('id') id: number, @Body() updateMagazineDto: UpdateMagazineDto): Promise<Magazine> {
    return this.magazineService.update(id, updateMagazineDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @AllowOnlyRole(Role.Admin)
  @ApiOperation({ summary: 'Elimina un artículo' })
  @ApiResponse({ status: 200, description: 'Artículo eliminado' })
  remove(@Param('id') id: number): Promise<void> {
    return this.magazineService.remove(id);
  }

}