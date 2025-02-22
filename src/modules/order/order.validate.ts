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
  userInfo: z.object({
    address: z.string().min(1, { message: "Address is required" }),
    email: z.string().email({ message: "Invalid email format" }),
    name: z.string().min(1, { message: "Name is required" }),
    phone: z.string().min(1, { message: "Phone is required" }),
  }),
  orderItems: z
    .array(
      z.object({
        availableQuantity: z
          .number()
          .min(0, { message: "Available quantity must be non-negative" }),
        imageUrl: z.string().url({ message: "Invalid image URL" }),
        name: z.string().min(1, { message: "Product name is required" }),
        _id: objectIdSchema,
        price: z
          .number()
          .positive({ message: "Price must be a positive number" }),
        purchaseQuantity: z
          .number()
          .int()
          .min(1, { message: "Purchase quantity must be at least 1" }),
      })
    )
    .nonempty({ message: "Order must contain at least one product" }),
  status: orderStatusEnum,
  paidAmount: z
    .number()
    .positive({ message: "Paid amount must be a positive number" }),
  txId: z.string().min(1, { message: "Transaction ID is required" }),
  __v: z.number().optional(),
});
