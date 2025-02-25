"use strict";
//Controller only handle application logic: it takes the request, send the response and call the service function for database operation
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
exports.getSingleUser = exports.getAllUsers = exports.updateUser = exports.blockUser = exports.createUser = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const user_service_1 = require("./user.service");
//Create a user data
exports.createUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, user_service_1.createUserToDB)(req.body);
    res.status(200).send({
        success: true,
        message: "User registered successfully!",
        data: result,
    });
}));
// Control request and response to block  a single user
const blockUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        const result = yield (0, user_service_1.blockUserInDB)(email);
        res.status(200).send({
            message: `User ${(result === null || result === void 0 ? void 0 : result.status) === "InActive" ? "inactivated" : "activated"} successfully`,
            status: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.blockUser = blockUser;
// Control request and response to update  a single user
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        const result = yield (0, user_service_1.updateUserToDB)(email, req.body);
        res.status(200).send({
            message: "User updated successfully",
            status: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateUser = updateUser;
// Control request and response to get all user
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, user_service_1.getAllUsersFromDB)();
        res.status(200).send({
            message: "All Users retrieved successfully",
            status: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllUsers = getAllUsers;
//Get sngle user
const getSingleUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, user_service_1.getSingleUserFromDB)(req.params.email);
        if (!result) {
            res.status(404).send({
                message: "User not found",
                status: false,
            });
            return;
        }
        res.status(200).send({
            message: "User retrieved successfully",
            status: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getSingleUser = getSingleUser;
// //Delete a student data
// export const deleteSingleStudent = catchAsync(async (req, res) => {
//   const result = await deleteSingleStudentFromDB(req.params.id);
//   res.status(200).send({
//     success: true,
//     message: "Student deleted successfully!",
//     data: result,
//   });
// });
