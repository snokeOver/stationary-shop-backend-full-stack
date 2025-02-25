"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderValidation = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
// Helper function to validate MongoDB ObjectId
const objectIdSchema = zod_1.z
    .string()
    .refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
});
// Define Order Status Enum
const orderStatusEnum = zod_1.z.enum([
    "Drafted",
    "Pending",
    "Shipping",
    "Received",
    "Rejected",
    "Deleted",
]);
exports.orderValidation = zod_1.z.object({
    userInfo: zod_1.z.object({
        address: zod_1.z.string().min(1, { message: "Address is required" }),
        email: zod_1.z.string().email({ message: "Invalid email format" }),
        name: zod_1.z.string().min(1, { message: "Name is required" }),
        phone: zod_1.z.string().min(1, { message: "Phone is required" }),
    }),
    orderItems: zod_1.z
        .array(zod_1.z.object({
        availableQuantity: zod_1.z
            .number()
            .min(0, { message: "Available quantity must be non-negative" }),
        imageUrl: zod_1.z.string().url({ message: "Invalid image URL" }),
        name: zod_1.z.string().min(1, { message: "Product name is required" }),
        _id: objectIdSchema,
        price: zod_1.z
            .number()
            .positive({ message: "Price must be a positive number" }),
        purchaseQuantity: zod_1.z
            .number()
            .int()
            .min(1, { message: "Purchase quantity must be at least 1" }),
    }))
        .nonempty({ message: "Order must contain at least one product" }),
    status: orderStatusEnum,
    paidAmount: zod_1.z
        .number()
        .positive({ message: "Paid amount must be a positive number" }),
    txId: zod_1.z.string().min(1, { message: "Transaction ID is required" }),
    __v: zod_1.z.number().optional(),
});
