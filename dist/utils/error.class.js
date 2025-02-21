"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = exports.NotFoundError = void 0;
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
    }
}
exports.NotFoundError = NotFoundError;
class AppError extends Error {
    constructor(statusCode, name, message, stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.name = name;
        this.message = message;
        this.stack = stack;
        this.statusCode = statusCode;
        this.name = name;
        if (stack)
            this.stack = stack;
        else
            Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
