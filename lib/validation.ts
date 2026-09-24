import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().min(2).max(80),
  business: z.string().max(120).optional(),
  phone: z.string().min(7).max(20),
  whatsapp: z.string().max(20).optional(),
  email: z.string().email().optional().or(z.literal("")),
  city: z.string().max(80).optional(),
  state: z.string().max(80).optional(),
  productId: z.string().optional(),
  sku: z.string().optional(),
  quantity: z.coerce.number().int().min(1).max(100000).optional(),
  message: z.string().max(2000).optional()
});

export const contactSchema = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().min(7).max(20),
  email: z.string().email().optional().or(z.literal("")),
  subject: z.string().max(140).optional(),
  message: z.string().min(3).max(3000)
});

export const productSchema = z.object({
  name: z.string().min(2).max(140),
  slug: z.string().min(2).max(160),
  sku: z.string().min(2).max(60),
  categoryId: z.string().min(1),
  description: z.string().max(8000).optional(),
  shortDesc: z.string().max(500).optional(),
  fabric: z.string().max(120).optional(),
  colours: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  moq: z.coerce.number().int().min(1).default(12),
  wholesalePrice: z.coerce.number().int().optional(),
  mrp: z.coerce.number().int().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "OUT_OF_STOCK", "ARCHIVED"]).default("ACTIVE"),
  featured: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  showPrice: z.boolean().default(false)
});
