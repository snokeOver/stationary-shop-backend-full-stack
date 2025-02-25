"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productValidation = void 0;
const zod_1 = require("zod");
// Define Category Enum
const categoryEnum = zod_1.z.enum([
    "Writing",
    "Office Supplies",
    "Art Supplies",
    "Educational",
    "Technology",
]);
exports.productValidation = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Product name is required" }),
    brand: zod_1.z.string().min(1, { message: "Brand name is required" }),
    imageUrl: zod_1.z.string().min(1, { message: "Product Image is required" }),
    price: zod_1.z.number().positive({ message: "Price must be a positive number" }),
    category: categoryEnum,
    description: zod_1.z
        .string()
        .min(10, { message: "Description must be at least 10 characters long" }),
    quantity: zod_1.z
        .number()
        .int()
        .min(0, { message: "Quantity must be a non-negative integer" }),
    inStock: zod_1.z.boolean(),
    isDeleted: zod_1.z.boolean().optional(),
});
