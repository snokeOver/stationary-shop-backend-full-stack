//This is the business logic

import { IUser } from "./user.interface";
import { UserModel } from "./user.model";

import { AppError } from "../../utils/error.class";

//Get all users from database
export const getAllUsersFromDB = async () => {
  const users = await UserModel.find();

  if (!users || users.length === 0) {
    throw new AppError(404, "No UsersFound", "No users found");
  }

  return users;
};

// Get a single user from the database by email
export const getSingleUserFromDB = async (email: string) => {
  const user = await UserModel.findOne({ email: email, isDeleted: false });

  if (!user) {
    throw new AppError(404, "This user not Found", "User does not exist");
  }

  return user;
};

// Create a user in to DB
export const createUserToDB = async (credentials: Partial<IUser>) => {
  const createdUser = await UserModel.create(credentials);

  if (!createdUser)
    throw new AppError(509, "Bad Request", "Failed to create user");

  return createdUser;
};

// update a user in to DB
export const updateUserToDB = async (
  email: string,
  credentials: Partial<IUser>
) => {
  const updatedUser = await UserModel.findOneAndUpdate(
    { email },
    { $set: credentials },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    throw new AppError(
      404,
      "User not found",
      "User not found or update failed"
    );
  }

  return updatedUser;
};

//Block a user
export const blockUserInDB = async (email: string) => {
  const foundUser = await UserModel.findOne({ email });

  if (!foundUser) {
    throw new AppError(
      404,
      "User not found",
      "User not found or block operation failed"
    );
  }

  const blockedUser = await UserModel.findOneAndUpdate(
    { email },
    {
      $set: { status: foundUser.status === "InActive" ? "Active" : "InActive" },
    },
    { new: true, runValidators: true }
  );

  return blockedUser;
};
