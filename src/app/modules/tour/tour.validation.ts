import { z } from "zod";

export const createTourZodSchema = z.object({
  title: z.string({ required_error: "Title is required" }),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),

  location: z.string().optional(),
  departureLocation: z.string().optional(),
  arrivalLocation: z.string().optional(),

  costFrom: z.number().min(0, "Cost must be a positive number").optional(),

  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),

  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  tourPlan: z.array(z.string()).optional(),

  maxGuest: z.number().min(1, "At least 1 guest required").optional(),
  minAge: z.number().min(0, "Age must be a positive number").optional(),

  division: z.string({ required_error: "Division is required" }),
  tourType: z.string({ required_error: "Tour Type is required" }),
});

export const updateTourZodSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  costFrom: z.number().optional(),
  startDate: z.string().optional().optional(),
  endDate: z.string().optional().optional(),
  tourType: z.string().optional(), // <- changed here
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  tourPlan: z.array(z.string()).optional(),
  maxGuest: z.number().optional(),
  minAge: z.number().optional(),
  departureLocation: z.string().optional(),
  arrivalLocation: z.string().optional(),
});

export const createTourTypeZodSchema = z.object({
  name: z.string(),
});
