import { ApiProperty } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { emailSchema } from "src/common/schemas/common.schemas";
import { z } from "zod";

export const LoginSchema = z.object({
    email: emailSchema,
    password: z.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
});

export class LoginDto extends createZodDto(LoginSchema) {}

