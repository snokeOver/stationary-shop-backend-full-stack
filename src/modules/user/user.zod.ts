import { z } from "zod";

export const userValidation = z.object({
  password: z
    .string({
      invalid_type_error: "Password must be a string",
    })
    .max(20, { message: "Password can't be more than 20 character" })
    .optional(),
  email: z.string().email({
    message: "Email must be a string",
  }),
  name: z.string({ required_error: "User Name is required" }),
  address: z.string().optional(),
});

export const userUpdateValidation = z.object({
  name: z.string({ required_error: "User Name is required" }).optional(),
  password: z
    .string({ invalid_type_error: "Password must be a string" })
    .max(20, { message: "Password can't be more than 20 characters" })
    .optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email({ message: "Invalid email format" }).optional(),
});
