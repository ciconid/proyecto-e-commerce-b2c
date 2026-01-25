import { z } from "zod";

export const emailSchema = z.email();
export const urlSchema = z.url();
export const uuidSchema = z.uuid('Debe ser un UUID valido');