// import { Module } from '@nestjs/common';
// import { CategoriesService } from './categories.service';
// import { CategoriesController } from './categories.controller';

// @Module({
//   controllers: [CategoriesController],
//   providers: [CategoriesService],
// })
// export class CategoriesModule {}



import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from '../entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
