import {
  jwt_access_expire,
  jwt_access_secret,
  jwt_refresh_expire,
  jwt_refresh_secret,
  saltRound,
} from "../..";
import { AppError } from "../../utils/error.class";

import { UserModel } from "../user/user.model";
import { IChangeUserPassword, ILoginUser } from "./auth.interface";

import bcrypt from "bcrypt";
import { createToken } from "./auth.utils";

import jwt, { JwtPayload } from "jsonwebtoken";

//Authenticate User Login
export const loginUserFromDB = async (payload: ILoginUser) => {
  const foundUser = await UserModel.isUserExist(payload.email);

  if (!foundUser)
    throw new AppError(
      404,
      "Either email or password is wrong",
      "This user doesn't exist !"
    );

  if (foundUser.status === "InActive")
    throw new AppError(
      403,
      "Security department deactivated your account",
      "This user is In-actice !"
    );

  // //password check
  if (
    !(await UserModel.isPasswordMatched(payload.password, foundUser.password))
  )
    throw new AppError(
      403,
      "Either email or password is wrong",
      "Either email or password is wrong"
    );

  const jwtPayload = {
    name: foundUser.name,
    email: foundUser.email,
    role: foundUser.role,
  };

  const accessToken = createToken(
    jwtPayload,
    jwt_access_secret as string,
    jwt_access_expire as string
  );

  const refreshToken = createToken(
    jwtPayload,
    jwt_refresh_secret as string,
    jwt_refresh_expire as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

//Authenticate for changed password
export const changePasswordIntoDB = async (
  payload: IChangeUserPassword,
  authData: JwtPayload
) => {
  const foundUser = await UserModel.isUserExist(authData.email);

  if (!foundUser)
    throw new AppError(404, "Not Exist", "This user doesn't exist !");

  if (foundUser.status === "InActive")
    throw new AppError(403, "Forbidden", "This user is In-actice !");

  // //password check
  if (
    !(await UserModel.isPasswordMatched(
      payload.oldPassword,
      foundUser.password
    ))
  )
    throw new AppError(403, "Forbidden", "Passowrd Not matched !");

  const hashedPass = await bcrypt.hash(payload.newPassword, Number(saltRound));

  const result = await UserModel.findOneAndUpdate(
    {
      email: authData.email,
      role: authData.role,
    },
    {
      password: hashedPass,
      needPasswordChange: false,
      passwordChangedAt: new Date(),
    },
    {
      new: true,
    }
  );

  void result;
  return null;
};

//Authenticate for refresh token
export const getTokenByRefreshTokenFromBackend = async (token: string) => {
  //Check if token is valid

  const decoded = jwt.verify(token, jwt_refresh_secret as string) as JwtPayload;

  const { email } = decoded;
  //Check if the user has permission
  const foundUser = await UserModel.isUserExist(email);

  if (!foundUser)
    throw new AppError(404, "Not Exist", "This user doesn't exist !");

  if (foundUser.status === "InActive")
    throw new AppError(403, "Forbidden", "This user is In-actice !");

  const jwtPayload = {
    name: foundUser.name,
    email: foundUser.email,
    role: foundUser.role,
  };
  const accessToken = createToken(
    jwtPayload,
    jwt_access_secret as string,
    jwt_access_expire as string
  );

  return { accessToken };
};
