import z from "zod";
import { isActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name must be between 3 and 50 characters" }),
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(20, { message: "Password must not exceed 20 characters" })
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/, {
      message:
        "Password must contain letters, numbers, and a special character (@$!%*?&)",
    }).optional(),
  phone: z
    .string()
    .regex(/^\+8801[3-9]\d{8}$/, {
      message:
        "Phone number must be a valid Bangladeshi number (e.g. 01XXXXXXXXX)",
    })
    .optional(),
  address: z
    .string()
    .min(3, { message: "Address must be provided" })
    .optional(),
});
export const updateUserZodSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name must be between 3 and 50 characters" })
    .optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(20, { message: "Password must not exceed 20 characters" })
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/, {
      message:
        "Password must contain letters, numbers, and a special character (@$!%*?&)",
    })
    .optional(),
  role: z.enum(Object.values(Role) as [string]),
  isActive: z.enum(Object.values(isActive) as [string]).optional(),
  isDeleted: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  phone: z
    .string()
    .regex(/^\+8801[3-9]\d{8}$/, {
      message:
        "Phone number must be a valid Bangladeshi number (e.g. 01XXXXXXXXX)",
    })
    .optional(),
  address: z
    .string()
    .min(3, { message: "Address must be provided" })
    .optional(),
});
