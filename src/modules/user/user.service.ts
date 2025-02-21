//This is the business logic

import { IUser } from "./user.interface";
import { UserModel } from "./user.model";

import { AppError } from "../../utils/error.class";

// Create a user in to DB
export const createUserToDB = async (credentials: Partial<IUser>) => {
  const createdUser = await UserModel.create(credentials);

  if (!createdUser)
    throw new AppError(509, "Bad Request", "Failed to create user");

  return createdUser;
};
