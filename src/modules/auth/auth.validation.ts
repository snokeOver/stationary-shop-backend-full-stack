import { z } from "zod";

export const loginValidation = z.object({
  email: z.string({
    required_error: "email is required",
  }),
  password: z.string({
    required_error: "User Password is required",
  }),
});

export const refreshTokenValidation = z.object({
  refreshToken: z.string({
    required_error: "Refresh Token is required",
  }),
});
