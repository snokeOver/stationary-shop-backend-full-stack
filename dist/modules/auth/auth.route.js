"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateData_1 = require("../../middlewares/validateData");
const auth_validation_1 = require("./auth.validation");
const auth_controller_1 = require("./auth.controller");
const authRoute = express_1.default.Router();
authRoute.post("/login", (0, validateData_1.validateRequest)(auth_validation_1.loginValidation), auth_controller_1.loginUser);
authRoute.post("/refresh-token", (0, validateData_1.validateTokenRequest)(auth_validation_1.refreshTokenValidation), auth_controller_1.getTokenByRefreshToken);
exports.default = authRoute;
