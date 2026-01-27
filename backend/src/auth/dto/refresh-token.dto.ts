import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const RefreshTokenDtoSchema = z.object({
    refresh_token: z.string().min(1, 'Refresh token requerido')
});

export class RefreshTokenDto extends createZodDto(RefreshTokenDtoSchema) {}