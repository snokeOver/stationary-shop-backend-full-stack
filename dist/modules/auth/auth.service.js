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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenByRefreshTokenFromBackend = exports.changePasswordIntoDB = exports.loginUserFromDB = void 0;
const __1 = require("../..");
const error_class_1 = require("../../utils/error.class");
const user_model_1 = require("../user/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_utils_1 = require("./auth.utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//Authenticate User Login
const loginUserFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const foundUser = yield user_model_1.UserModel.isUserExist(payload.email);
    if (!foundUser)
        throw new error_class_1.AppError(404, "Either email or password is wrong", "This user doesn't exist !");
    if (foundUser.status === "InActive")
        throw new error_class_1.AppError(403, "Security department deactivated your account", "This user is In-actice !");
    // //password check
    if (!(yield user_model_1.UserModel.isPasswordMatched(payload.password, foundUser.password)))
        throw new error_class_1.AppError(403, "Either email or password is wrong", "Either email or password is wrong");
    const jwtPayload = {
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, __1.jwt_access_secret, __1.jwt_access_expire);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, __1.jwt_refresh_secret, __1.jwt_refresh_expire);
    return {
        accessToken,
        refreshToken,
    };
});
exports.loginUserFromDB = loginUserFromDB;
//Authenticate for changed password
const changePasswordIntoDB = (payload, authData) => __awaiter(void 0, void 0, void 0, function* () {
    const foundUser = yield user_model_1.UserModel.isUserExist(authData.email);
    if (!foundUser)
        throw new error_class_1.AppError(404, "Not Exist", "This user doesn't exist !");
    if (foundUser.status === "InActive")
        throw new error_class_1.AppError(403, "Forbidden", "This user is In-actice !");
    // //password check
    if (!(yield user_model_1.UserModel.isPasswordMatched(payload.oldPassword, foundUser.password)))
        throw new error_class_1.AppError(403, "Forbidden", "Passowrd Not matched !");
    const hashedPass = yield bcrypt_1.default.hash(payload.newPassword, Number(__1.saltRound));
    const result = yield user_model_1.UserModel.findOneAndUpdate({
        email: authData.email,
        role: authData.role,
    }, {
        password: hashedPass,
        needPasswordChange: false,
        passwordChangedAt: new Date(),
    }, {
        new: true,
    });
    void result;
    return null;
});
exports.changePasswordIntoDB = changePasswordIntoDB;
//Authenticate for refresh token
const getTokenByRefreshTokenFromBackend = (token) => __awaiter(void 0, void 0, void 0, function* () {
    //Check if token is valid
    const decoded = jsonwebtoken_1.default.verify(token, __1.jwt_refresh_secret);
    const { email } = decoded;
    //Check if the user has permission
    const foundUser = yield user_model_1.UserModel.isUserExist(email);
    if (!foundUser)
        throw new error_class_1.AppError(404, "Not Exist", "This user doesn't exist !");
    if (foundUser.status === "InActive")
        throw new error_class_1.AppError(403, "Forbidden", "This user is In-actice !");
    const jwtPayload = {
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, __1.jwt_access_secret, __1.jwt_access_expire);
    return { accessToken };
});
exports.getTokenByRefreshTokenFromBackend = getTokenByRefreshTokenFromBackend;
