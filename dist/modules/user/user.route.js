"use strict";
//Controller will only handle the routes with the help of express route and call the controller function
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const validateData_1 = require("../../middlewares/validateData");
const user_zod_1 = require("./user.zod");
const auth_1 = require("../../middlewares/auth");
const userRoute = express_1.default.Router();
userRoute.post("/register", (0, validateData_1.validateRequest)(user_zod_1.userValidation), user_controller_1.createUser);
userRoute.get("/", user_controller_1.getAllUsers);
userRoute.get("/:email", user_controller_1.getSingleUser);
userRoute.patch("/:email", (0, validateData_1.validateRequest)(user_zod_1.userUpdateValidation), (0, auth_1.auth)("User"), user_controller_1.updateUser);
userRoute.patch("/toogle-activation/:email", (0, auth_1.auth)("Admin"), user_controller_1.blockUser);
exports.default = userRoute;
