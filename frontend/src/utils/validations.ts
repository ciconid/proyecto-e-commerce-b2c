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

export const createProductSchema = z.object({
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    description: z.string().optional(),
    price: z.number().positive('El precio debe ser positivo'),
    stock: z.number().int().min(0, 'El stock no puede ser negativo'),
    imageUrl: z.string().url('URL inválida').optional().or(z.literal('')),
});
