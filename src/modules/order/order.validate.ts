import { z } from "zod";
import mongoose from "mongoose";

// Helper function to validate MongoDB ObjectId
const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });

// Define Order Status Enum
const orderStatusEnum = z.enum([
  "Drafted",
  "Pending",
  "Shipping",
  "Received",
  "Rejected",
  "Deleted",
]);

export const orderValidation = z.object({
  email: z.string().email({ message: "Invalid email format" }),

  mainOrder: z
    .array(
      z.object({
        product: objectIdSchema,
        quantity: z
          .number()
          .int()
          .min(1, { message: "Quantity must be at least 1" }),
        price: z
          .number()
          .positive({ message: "Price must be a positive number" }),
      })
    )
    .nonempty({ message: "Order must contain at least one product" }),

  status: orderStatusEnum,

  totalPrice: z
    .number()
    .positive({ message: "Total price must be a positive number" }),
});
