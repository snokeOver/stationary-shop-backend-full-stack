//Controller will only handle the routes with the help of express route and call the controller function

import express from "express";
import {
  blockUser,
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
} from "./user.controller";

import { validateRequest } from "../../middlewares/validateData";
import { userUpdateValidation, userValidation } from "./user.zod";
import { auth } from "../../middlewares/auth";

const userRoute = express.Router();

userRoute.post("/register", validateRequest(userValidation), createUser);
userRoute.get("/", getAllUsers);
userRoute.get("/:email", getSingleUser);

userRoute.patch(
  "/:email",
  validateRequest(userUpdateValidation),
  auth("User"),
  updateUser
);
userRoute.patch("/toogle-activation/:email", auth("Admin"), blockUser);

export default userRoute;
