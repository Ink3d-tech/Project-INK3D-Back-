/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from 'src/entities/product.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Role } from 'src/roles.enum';
import { AllowOnlyRole } from 'src/decorators/allow-only-role.decorator';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'Get all products successfully',
  })
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search products by' })
  @ApiResponse({ status: 200, description: 'Products found' })
  search(@Query('q') query: string): Promise<Product[]> {
    return this.productsService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Product found successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Product | null> {
    return this.productsService.findOne(id);
  }


  @Get('style/:style')
  async getByStyle(@Param('style') style: string): Promise<Product[]> {
    return this.productsService.findByStyle(style);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AllowOnlyRole(Role.Admin)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  async create(@Body() productData: CreateProductDto): Promise<Product> {
    return this.productsService.create(productData);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AllowOnlyRole(Role.Admin)
  @ApiParam({
    name: 'id',
    description: 'Product id',
    required: true,
    type: String,
    example: '1fe09b55-d8af-4f82-ac8d-b82489af2d70',
  })
  @ApiBody({
    type: UpdateProductDto,
    description: 'Product data to be updated',
    examples: {
      'product.update': {
        value: {
          name: 'Laptop Gamer',
          description: 'Laptop de alta gama para gaming',
          price: 1500.99,
          stock: 10,
          image: 'https://imagen.com/laptop.jpg',
          discount: 5,
          category: '1fe09b55-d8af-4f82-ac8d-b82489af2d70',
        },
      },
      'product.update.category.id': {
        value: '1fe09b55-d8af-4f82-ac8d-b82489af2d70',
      },
    },
  })
  @ApiOperation({ summary: 'Update an existing product' })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    example: {
      id: '1fe09b55-d8af-4f82-ac8d-b82489af2d70',
      name: 'Laptop Gamer',
      description: 'Laptop de alta gama para gaming',
      price: 1500.99,
      stock: 10,
      image: 'https://imagen.com/laptop.jpg',
      discount: 5,
      category: {
        id: '1fe09b55-d8af-4f82-ac8d-b82489af2d70',
        name: 'Laptop Gamer',
      },
      orders: [],
      reviews: [],
      isActive: true,
    },
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() productData: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.updateProduct(id, productData);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AllowOnlyRole(Role.Admin)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 204, description: 'Product deleted from database' })
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.delete(id);
  }

  @Patch(':id/deactivate')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AllowOnlyRole(Role.Admin)
  @ApiOperation({ summary: 'Deactivate a product' })
  @ApiResponse({ status: 200, description: 'Product deactivated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async deactivateProduct(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Product> {
    return this.productsService.deactivateProduct(id);
  }

  @Patch(':id/activate')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @AllowOnlyRole(Role.Admin)
  @ApiOperation({ summary: 'Activate a product' })
  @ApiResponse({ status: 200, description: 'Product activated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async activateProduct(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Product> {
    return this.productsService.activateProduct(id);
  }
}

