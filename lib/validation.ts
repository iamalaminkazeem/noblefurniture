// Zod schemas — real request validation instead of just null-checks.
import { z } from "zod";

export const quoteSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  location: z.string().min(2).max(200),
  furnitureType: z.string().min(2).max(100),
  budgetRange: z.string().optional(),
  description: z.string().min(5).max(2000),
  preferredDate: z.string().optional(),
  recaptchaToken: z.string().optional(),
  website: z.string().optional(), // honeypot — checked in application code, not schema-enforced
});

export const contactSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  message: z.string().min(5).max(2000),
  recaptchaToken: z.string().optional(),
  website: z.string().optional(),
});

export const consultationSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  preferredDate: z.string().min(1),
  notes: z.string().max(2000).optional(),
  recaptchaToken: z.string().optional(),
  website: z.string().optional(),
});

export const checkoutSchema = z.object({
  email: z.string().email(),
  address: z.string().min(5).max(300),
  customerName: z.string().min(2).max(120),
  phone: z.string().min(7).max(20),
  items: z.array(z.object({ productId: z.string(), quantity: z.number().int().min(1).max(50) })).min(1),
});