import { Controller, Get, Post, Put, Delete, Body, Param, ParseArrayPipe, ParseUUIDPipe } from '@nestjs/common';

import { Category } from 'src/entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Category | null> {
    return this.categoriesService.findOne(id);
  }

  @Post()
  create(@Body() categoryData: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(categoryData);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() categoryData: UpdateCategoryDto): Promise<Category> {
    return this.categoriesService.update(id, categoryData);
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.delete(id);
  }
}

