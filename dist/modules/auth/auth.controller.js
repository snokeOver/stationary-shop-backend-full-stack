"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.getTokenByRefreshToken = exports.loginUser = void 0;
const __1 = require("../..");
const catchAsync_1 = require("../../utils/catchAsync");
const auth_service_1 = require("./auth.service");
exports.loginUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, auth_service_1.loginUserFromDB)(req.body);
    const { accessToken, refreshToken } = result;
    res.cookie("refreshToken", refreshToken, {
        secure: __1.nodeEnv !== "development",
        httpOnly: true,
    });
    res.status(200).send({
        success: true,
        message: "Login success!",
        data: {
            accessToken,
        },
    });
}));
exports.getTokenByRefreshToken = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, auth_service_1.getTokenByRefreshTokenFromBackend)(req.cookies.refreshToken);
    res.status(200).send({
        success: true,
        message: "token by refresh token send success!",
        data: result,
    });
}));
exports.changePassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, auth_service_1.changePasswordIntoDB)(req.body, req.user);
    res.status(200).send({
        success: true,
        message: "Password Updated successfully!",
        data: result,
    });
}));
