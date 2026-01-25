import { PartialType } from '@nestjs/swagger';
import { AddToCartDto } from './add-to-cart.dto';
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const UpdateCartItemSchema = z.object({
    quantity: z.number()
        .int('Debe ser un numero entero')
        .positive('Debe ser positivo')
});

export class UpdateCartItemDto extends createZodDto(UpdateCartItemSchema) {}
