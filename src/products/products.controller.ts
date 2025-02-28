import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductCombinationDto } from './dto/product-combination.dto';
import { UpdateProductCombinationDto } from './dto/update-combination.dto';
import { Product } from 'src/entities/product.entity';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: Product,
  })
  async create(
    @Body() createProductDto: CreateProductDto,
    @Body('combinations') combinationsDto: CreateProductCombinationDto[],
  ): Promise<Product> {
    return this.productsService.createProduct(
      createProductDto,
      combinationsDto,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Body('combinations') combinationsDto?: UpdateProductCombinationDto[],
  ): Promise<Product> {
    updateProductDto.id = id;
    return this.productsService.updateProduct(
      updateProductDto,
      combinationsDto,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.productsService.deleteProduct(id);
  }

  @Put(':id/toggle-status')
  async toggleStatus(@Param('id') id: string): Promise<Product> {
    return this.productsService.toggleProductStatus(id);
  }
}
