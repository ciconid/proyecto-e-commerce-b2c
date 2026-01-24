import { z } from "zod";

export const emailSchema = z.email();
export const urlSchema = z.url();