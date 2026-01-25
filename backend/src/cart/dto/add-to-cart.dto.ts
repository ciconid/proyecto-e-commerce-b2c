import { createZodDto } from "nestjs-zod";
import { uuidSchema } from "src/common/schemas/common.schemas";
import { z } from "zod";

export const AddToCartSchema = z.object({
    productId: uuidSchema,
    quantity: z.number()
        .int('Debe ser un numero entero')
        .positive('Debe ser positivo')
});

export class AddToCartDto extends createZodDto(AddToCartSchema) {}
