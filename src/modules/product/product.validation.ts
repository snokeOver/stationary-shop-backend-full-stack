import { z } from "zod";

// Define Category Enum
const categoryEnum = z.enum([
  "Writing",
  "Office Supplies",
  "Art Supplies",
  "Educational",
  "Technology",
]);

export const productValidation = z.object({
  name: z.string().min(1, { message: "Product name is required" }),
  brand: z.string().min(1, { message: "Brand name is required" }),
  price: z.number().positive({ message: "Price must be a positive number" }),
  category: categoryEnum,
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" }),
  quantity: z
    .number()
    .int()
    .min(0, { message: "Quantity must be a non-negative integer" }),
  inStock: z.boolean(),
  isDeleted: z.boolean().optional(),
});
