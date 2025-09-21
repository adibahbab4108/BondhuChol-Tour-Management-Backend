import { z } from "zod";

export const createDivisionSchema = z.object({
  name: z.string().min(2),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
});

export const updateDivisionSchema = z.object({
  name: z.string().min(2).optional(),
//   slug: z.string().optional(),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
});
