import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    const categories = await this.categoryRepository.find();
    console.log(categories);
    return categories;
  }

  async findOne(id: string): Promise<Category | null> {
    return this.categoryRepository.findOne({ where: { id } });
  }

  async create(categoryData: CreateCategoryDto): Promise<Category> {
    const newCategory = this.categoryRepository.create(categoryData);
    return this.categoryRepository.save(newCategory);
  }

  async update(
    id: string,
    categoryData: UpdateCategoryDto,
  ): Promise<Category | null> {
    const category = await this.findOne(id);
    if (!category) {
      return null;
    }
    Object.assign(category, categoryData);
    return this.categoryRepository.save(category);
  }

  async delete(id: string): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
