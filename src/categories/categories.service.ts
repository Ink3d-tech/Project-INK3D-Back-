// import { Injectable } from '@nestjs/common';
// import { CreateCategoryDto } from './dto/create-category.dto';
// import { UpdateCategoryDto } from './dto/update-category.dto';

// @Injectable()
// export class CategoriesService {
//   create(createCategoryDto: CreateCategoryDto) {
//     return 'This action adds a new category';
//   }

//   findAll() {
//     return `This action returns all categories`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} category`;
//   }

//   update(id: number, updateCategoryDto: UpdateCategoryDto) {
//     return `This action updates a #${id} category`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} category`;
//   }
// }



import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const newCategory = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(newCategory);
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findOne(id: string) {
    return await this.categoryRepository.findOne({ where: { id } });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.categoryRepository.update(id, updateCategoryDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.categoryRepository.delete(id);
    return { message: `Category ${id} deleted` };
  }
}
