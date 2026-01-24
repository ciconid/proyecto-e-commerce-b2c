import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto, CreateProductSchema } from './create-product.dto';
import { createZodDto } from 'nestjs-zod';

export class UpdateProductDto extends createZodDto(CreateProductSchema.partial()) {}
