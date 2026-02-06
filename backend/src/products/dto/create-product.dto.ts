import { ApiProperty } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { urlSchema } from "src/common/schemas/common.schemas";
import { z } from "zod";

export const CreateProductSchema = z.object({
    name: z.string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(100),
    description: z.string()
        .optional(),
    price: z.number()
        .positive('El precio debe ser positivo'),
    stock: z.number()
        .int('El stock debe ser un numero entero')
        .min(0, 'El stock no puede ser negativo'),
    imageUrl: urlSchema
        .optional()
    

});

export class CreateProductDto extends createZodDto(CreateProductSchema) {}

