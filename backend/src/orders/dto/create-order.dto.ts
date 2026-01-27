import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const CreateOrderDtoSchema = z.object({});

export class CreateOrderDto extends createZodDto(CreateOrderDtoSchema) {}
