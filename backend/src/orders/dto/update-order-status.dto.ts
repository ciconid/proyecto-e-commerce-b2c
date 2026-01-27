import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const UpdateOrderStatusDtoSchema = z.object({
    status: z.enum(['pendiente', 'completada', 'cancelada'], {
        message: 'Estado debe ser pendiente, completada o cancelada'
    })
});

export class UpdateOrderStatusDto extends createZodDto(UpdateOrderStatusDtoSchema) {}
