"use strict";
//This is the business logic
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
exports.blockUserInDB = exports.updateUserToDB = exports.createUserToDB = exports.getSingleUserFromDB = exports.getAllUsersFromDB = void 0;
const user_model_1 = require("./user.model");
const error_class_1 = require("../../utils/error.class");
//Get all users from database
const getAllUsersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.UserModel.find();
    if (!users || users.length === 0) {
        throw new error_class_1.AppError(404, "No UsersFound", "No users found");
    }
    return users;
});
exports.getAllUsersFromDB = getAllUsersFromDB;
// Get a single user from the database by email
const getSingleUserFromDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UserModel.findOne({ email: email, isDeleted: false });
    if (!user) {
        throw new error_class_1.AppError(404, "This user not Found", "User does not exist");
    }
    return user;
});
exports.getSingleUserFromDB = getSingleUserFromDB;
// Create a user in to DB
const createUserToDB = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const createdUser = yield user_model_1.UserModel.create(credentials);
    if (!createdUser)
        throw new error_class_1.AppError(509, "Bad Request", "Failed to create user");
    return createdUser;
});
exports.createUserToDB = createUserToDB;
// update a user in to DB
const updateUserToDB = (email, credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield user_model_1.UserModel.findOneAndUpdate({ email }, { $set: credentials }, { new: true, runValidators: true });
    if (!updatedUser) {
        throw new error_class_1.AppError(404, "User not found", "User not found or update failed");
    }
    return updatedUser;
});
exports.updateUserToDB = updateUserToDB;
//Block a user
const blockUserInDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const foundUser = yield user_model_1.UserModel.findOne({ email });
    if (!foundUser) {
        throw new error_class_1.AppError(404, "User not found", "User not found or block operation failed");
    }
    const blockedUser = yield user_model_1.UserModel.findOneAndUpdate({ email }, {
        $set: { status: foundUser.status === "InActive" ? "Active" : "InActive" },
    }, { new: true, runValidators: true });
    return blockedUser;
});
exports.blockUserInDB = blockUserInDB;
