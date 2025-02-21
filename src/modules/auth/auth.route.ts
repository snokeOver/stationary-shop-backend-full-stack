import express from "express";

import {
  validateRequest,
  validateTokenRequest,
} from "../../middlewares/validateData";
import { loginValidation, refreshTokenValidation } from "./auth.validation";
import { getTokenByRefreshToken, loginUser } from "./auth.controller";

const authRoute = express.Router();

authRoute.post("/login", validateRequest(loginValidation), loginUser);

authRoute.post(
  "/refresh-token",
  validateTokenRequest(refreshTokenValidation),
  getTokenByRefreshToken
);

export default authRoute;
