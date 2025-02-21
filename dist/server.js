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
exports.connectToDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const _1 = require(".");
const error_class_1 = require("./utils/error.class");
const cached = { conn: null, promise: null };
const connectToDB = () => __awaiter(void 0, void 0, void 0, function* () {
    if (cached.conn)
        return cached.conn;
    if (!_1.mongoUrl)
        throw new error_class_1.AppError(500, "Missing Variable", "MongoDB Url is missing in env file");
    try {
        cached.promise = mongoose_1.default
            .connect(_1.mongoUrl)
            .then((mongoseInstace) => mongoseInstace);
    }
    catch (error) {
        cached.promise = null;
        throw new error_class_1.AppError(503, "Database unavailable", "Failed to connect to MongoDB with error");
        void error;
    }
    cached.conn = yield cached.promise;
    console.log("MongoDB connection successfull !");
    return cached.conn;
});
exports.connectToDB = connectToDB;
