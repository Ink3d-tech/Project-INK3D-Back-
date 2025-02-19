import { Controller, Get, Post, Body, Param, Delete, Put, Query, ParseUUIDPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from 'src/entities/product.entity';
import { CreateProductDto } from './dto/createProduct.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('productos')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}


  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({ status: 200, description: 'Lista de productos obtenida correctamente' })
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }
  @Get('search')
  @ApiOperation({ summary: 'Buscar productos por nombre o descripción' })
  @ApiResponse({ status: 200, description: 'Productos encontrados' })
  search(@Query('q') query: string): Promise<Product[]> {
    return this.productsService.search(query);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Product | null> {
    return this.productsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado correctamente' })
  async create(@Body() productData: CreateProductDto): Promise<Product> {
    return this.productsService.create(productData);
  }
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un producto existente' })
  @ApiResponse({ status: 200, description: 'Producto actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  update(@Param('id',ParseUUIDPipe) id: string, @Body() productData: Partial<Product>): Promise<Product | null> {
    return this.productsService.update(id, productData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiResponse({ status: 204, description: 'Producto eliminado correctamente' })
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.delete(id);
  }
}
