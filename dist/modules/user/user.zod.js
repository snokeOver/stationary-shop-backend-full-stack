"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpdateValidation = exports.userValidation = void 0;
const zod_1 = require("zod");
exports.userValidation = zod_1.z.object({
    password: zod_1.z
        .string({
        invalid_type_error: "Password must be a string",
    })
        .max(20, { message: "Password can't be more than 20 character" })
        .optional(),
    email: zod_1.z.string().email({
        message: "Email must be a string",
    }),
    name: zod_1.z.string({ required_error: "User Name is required" }),
    address: zod_1.z.string().optional(),
});
exports.userUpdateValidation = zod_1.z.object({
    name: zod_1.z.string({ required_error: "User Name is required" }).optional(),
    password: zod_1.z
        .string({ invalid_type_error: "Password must be a string" })
        .max(20, { message: "Password can't be more than 20 characters" })
        .optional(),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    email: zod_1.z.string().email({ message: "Invalid email format" }).optional(),
});
