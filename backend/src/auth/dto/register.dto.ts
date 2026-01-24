import { ApiProperty } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { emailSchema } from "src/common/schemas/common.schemas";
import { z } from "zod";

export const RegisterSchema = z.object({
    name: z.string()
        .min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: emailSchema,
    password: z.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
});

export class RegisterDto extends createZodDto(RegisterSchema) {}
