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
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const __1 = require("../..");
const bcrypt_1 = __importDefault(require("bcrypt"));
const error_class_1 = require("../../utils/error.class");
const user_constant_1 = require("./user.constant");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: 0,
    },
    address: {
        type: String,
        required: false,
        default: "",
    },
    phone: {
        type: String,
        required: false,
        default: "",
    },
    role: {
        type: String,
        enum: {
            values: ["Admin", "User"],
        },
        default: user_constant_1.USER_ROLE.User,
    },
    status: {
        type: String,
        enum: {
            values: ["Active", "InActive"],
        },
        default: "Active",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    strict: "throw", // prevents extra fields and throw error
});
//Pre save middleware: will work on create() and save() to encrypt password
userSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        const isUserExist = yield exports.UserModel.findOne({
            email: this.email,
        });
        if (isUserExist)
            throw new error_class_1.AppError(409, "This User is already exist", "This User is already exist !");
        this.password = yield bcrypt_1.default.hash(this.password, Number(__1.saltRound));
    });
});
//To check if the user id exist or not before delete
userSchema.pre("findOneAndUpdate", function () {
    return __awaiter(this, void 0, void 0, function* () {
        const isUserExist = yield exports.UserModel.findOne(this.getQuery());
        if (!isUserExist) {
            throw new error_class_1.AppError(404, "User Not Found", "The user you are trying to update does not exist!");
        }
    });
});
//post save middleware to hide password
userSchema.post("save", function () {
    this.password = "";
});
//static method
userSchema.statics.isUserExist = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.UserModel.findOne({
            email,
            isDeleted: false,
        }).select("+password");
    });
};
userSchema.statics.isPasswordMatched = function (password, hashedPass) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, hashedPass);
    });
};
userSchema.statics.isJWTValidYet = function (passChangedAt, jwtIssuedAt) {
    const passwordChageTime = new Date(passChangedAt).getTime() / 1000;
    return passwordChageTime > jwtIssuedAt;
};
exports.UserModel = (0, mongoose_1.model)("users", userSchema);
