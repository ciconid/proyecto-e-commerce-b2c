import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Crear un nuevo producto'})
  @ApiResponse({status: 201, description: 'Producto creado con exito'})
  @ApiResponse({status: 400, description: 'Informacion invalida'})
  @ApiResponse({status: 401, description: 'No autorizado'})
  @ApiResponse({status: 403, description: 'Acceso prohibido - solo admin'})
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({summary: 'Obtener todos los productos'})
  @ApiResponse({status: 200, description: 'Lista de productos'})
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({summary: 'Obtener un producto por su ID'})
  @ApiParam({name: 'id', description: 'UUID del producto'})
  @ApiResponse({status: 200, description: 'Producto encontrado'})
  @ApiResponse({status: 404, description: 'Producto no encontrado'})
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Actulizar info de un producto'})
  @ApiParam({name: 'id', description: 'UUID del producto'})
  @ApiResponse({status: 200, description: 'Producto actualizado con exito'})
  @ApiResponse({status: 401, description: 'No autorizado'})
  @ApiResponse({status: 403, description: 'Acceso prohibido - solo admin'})
  @ApiResponse({status: 404, description: 'Producto no encontrado'})
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({summary: 'Eliminar un producto'})
  @ApiBearerAuth()
  @ApiParam({name: 'id', description: 'UUID del producto'})
  @ApiResponse({status: 200, description: 'Producto eliminado con exito'})
  @ApiResponse({status: 401, description: 'No autorizado'})
  @ApiResponse({status: 403, description: 'Acceso prohibido - solo admin'})
  @ApiResponse({status: 404, description: 'Producto no encontrado'})
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
