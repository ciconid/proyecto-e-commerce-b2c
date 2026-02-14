import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, UseInterceptors, BadRequestException, Request } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    @Post()
    @Roles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear un nuevo producto' })
    @ApiResponse({ status: 201, description: 'Producto creado con exito' })
    @ApiResponse({ status: 400, description: 'Informacion invalida' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 403, description: 'Acceso prohibido - solo admin' })
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los productos' })
    @ApiResponse({ status: 200, description: 'Lista de productos' })
    findAll() {
        return this.productsService.findAll();
    }

    @Get("all")
    @Roles("admin")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Obtener todos los productos incluyendo inactivos" })
    @ApiResponse({ status: 200, description: "Lista completa de productos" })
    findAllAdmin() {
        return this.productsService.findAllAdmin();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un producto por su ID' })
    @ApiParam({ name: 'id', description: 'UUID del producto' })
    @ApiResponse({ status: 200, description: 'Producto encontrado' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    @Roles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Actulizar info de un producto' })
    @ApiParam({ name: 'id', description: 'UUID del producto' })
    @ApiResponse({ status: 200, description: 'Producto actualizado con exito' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 403, description: 'Acceso prohibido - solo admin' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    @Roles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Eliminar un producto' })
    @ApiBearerAuth()
    @ApiParam({ name: 'id', description: 'UUID del producto' })
    @ApiResponse({ status: 200, description: 'Producto eliminado con exito' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 403, description: 'Acceso prohibido - solo admin' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }

    @Post("upload")
    @Roles("admin")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Subir imagen de producto a Cloudinary' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Imagen del producto (JPG, PNG, WEBP)',
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Imagen subida exitosamente',
        schema: {
            type: 'object',
            properties: {
                imageUrl: {
                    type: 'string',
                    example: 'https://res.cloudinary.com/tu-cloud/image/upload/v1234567890/ecommerce/products/abc123.jpg'
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 403, description: 'Acceso prohibido - solo admin' })
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No se proporcionó ningún archivo');
        }

        const imageUrl = await this.cloudinaryService.uploadImage(file);
        return imageUrl;
    }

    @Patch(":id/toggle-active")
    @Roles("admin")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Activar o desactivar un producto" })
    @ApiParam({ name: "id", description: "UUID del producto" })
    @ApiResponse({ status: 200, description: "Estado del producto actualizado" })
    @ApiResponse({ status: 401, description: "No autorizado" })
    @ApiResponse({ status: 403, description: "Acceso prohibido - solo admin" })
    toggleActive(@Param("id") id: string) {
        return this.productsService.toggleActive(id);
    }

}
