import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';

import { Category } from 'src/entities/category.entity';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHideProperty,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { AllowOnlyRole } from 'src/decorators/allow-only-role.decorator';
import { Role } from 'src/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    type: Promise<Category[]>,
    isArray: true,
    example: [
      {
        id: '79062eed-7d51-431a-828c-db47feb9e3f7',
        name: 'Remeras',
      },
      {
        id: '79062eed-7d51-431a-828c-db47feb9e3f7',
        name: 'Pantalones',
      },
      {
        id: '79062eed-7d51-431a-828c-db47feb9e3f7',
        name: 'Zapatos',
      },
    ],
  })
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by id' })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    example: '79062eed-7d51-431a-828c-db47feb9e3f7',
  })
  @ApiResponse({
    status: 200,
    type: Category,
    example: {
      id: '79062eed-7d51-431a-828c-db47feb9e3f7',
      name: 'Remeras',
    },
  })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Category | null> {
    return this.categoriesService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AllowOnlyRole(Role.Admin)
  @Post()
  @ApiOperation({ summary: 'Create a category' })
  @ApiBody({
    type: CreateCategoryDto,
    examples: {
      'category.create': {
        value: {
          name: 'Buzos',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    type: Category,
    example: {
      id: '79062eed-7d51-431a-828c-db47feb9e3f7',
      name: 'Remeras',
    },
  })
  create(@Body() categoryData: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(categoryData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    example: '79062eed-7d51-431a-828c-db47feb9e3f7',
  })
  @ApiBody({
    type: UpdateCategoryDto,
    examples: {
      'category.update': {
        value: {
          name: 'Zapatos',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    type: Category,
    example: {
      id: '79062eed-7d51-431a-828c-db47feb9e3f7',
      name: 'Pantalones',
    },
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() categoryData: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.update(id, categoryData);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AllowOnlyRole(Role.Admin)
  @Delete(':id')
  @ApiHideProperty()
  @ApiOperation({ summary: 'Delete a category' })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    example: '79062eed-7d51-431a-828c-db47feb9e3f7',
  })
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.delete(id);
  }
}
