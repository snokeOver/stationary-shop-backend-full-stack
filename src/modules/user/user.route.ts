//Controller will only handle the routes with the help of express route and call the controller function

import express from "express";
import { createUser } from "./user.controller";

import { validateRequest } from "../../middlewares/validateData";
import { userValidation } from "./user.zod";

const userRoute = express.Router();

userRoute.post("/register", validateRequest(userValidation), createUser);

export default userRoute;
