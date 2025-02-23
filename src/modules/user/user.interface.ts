import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface IUser {
  name: string;
  email: string;
  password: string;
  address?: string;
  phone?: string;
  role: "User" | "Admin";
  status: "Active" | "InActive";
  isDeleted: boolean;
}

export interface IUserModel extends Model<IUser> {
  isUserExist(email: string): Promise<IUser>;
  isPasswordMatched(password: string, hashedPass: string): Promise<boolean>;
  isJWTValidYet(passChangedAt: Date, jwtIssuedAt: number): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
