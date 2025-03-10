import { nodeEnv } from "../..";
import { catchAsync } from "../../utils/catchAsync";
import {
  changePasswordIntoDB,
  getTokenByRefreshTokenFromBackend,
  loginUserFromDB,
} from "./auth.service";

export const loginUser = catchAsync(async (req, res) => {
  const result = await loginUserFromDB(req.body);
  const { accessToken, refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: nodeEnv !== "development",
    httpOnly: true,
  });

  res.status(200).send({
    success: true,
    message: "Login success!",
    data: {
      accessToken,
    },
  });
});

export const getTokenByRefreshToken = catchAsync(async (req, res) => {
  const result = await getTokenByRefreshTokenFromBackend(
    req.cookies.refreshToken
  );

  res.status(200).send({
    success: true,
    message: "token by refresh token send success!",
    data: result,
  });
});

export const changePassword = catchAsync(async (req, res) => {
  const result = await changePasswordIntoDB(req.body, req.user);

  res.status(200).send({
    success: true,
    message: "Password Updated successfully!",
    data: result,
  });
});
