"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenValidation = exports.loginValidation = void 0;
const zod_1 = require("zod");
exports.loginValidation = zod_1.z.object({
    email: zod_1.z.string({
        required_error: "email is required",
    }),
    password: zod_1.z.string({
        required_error: "User Password is required",
    }),
});
exports.refreshTokenValidation = zod_1.z.object({
    refreshToken: zod_1.z.string({
        required_error: "Refresh Token is required",
    }),
});
