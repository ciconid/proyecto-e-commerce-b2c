import { z } from "zod";

const emailSchema = z.email();

export const loginSchema = z.object({
    email: emailSchema,
    password: z.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
});

export const registerSchema = z.object({
    name: z.string()
        .min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: emailSchema,
    password: z.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
});