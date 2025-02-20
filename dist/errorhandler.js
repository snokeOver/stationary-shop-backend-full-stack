"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.errorHandler = void 0;
const mongoose_1 = require("mongoose");
const errorHandler = (error, req, res, next) => {
    let errMsg = "Server error";
    let statusCode = 500;
    let errorDetails = error.errors;
    //Check for specific error
    if (error.name === "NotFoundError") {
        errMsg = error.message;
        statusCode = 404;
    }
    else if (error.name === "StrictModeError") {
        const msg = error.message;
        errMsg = "Additional field not allowed";
        statusCode = 400;
        errorDetails = {
            error: msg.split(" ").slice(1).join(" "),
        };
    }
    else if (error instanceof mongoose_1.Error.ValidationError) {
        errMsg = "Validation failed";
        statusCode = 400;
    }
    else if (error.code === 11000) {
        errorDetails = error.errorResponse;
        errMsg = `Duplicate value for field: ${Object.keys(error.keyValue)[0]}`;
        statusCode = 409;
    }
    else {
        errMsg = error.message || "Server error";
    }
    const response = {
        message: errMsg,
        success: false,
        error: {
            name: error.name || "UnknownError",
            errors: errorDetails,
        },
        stack: error.stack,
        // stack: node_env === "development" ? error.stack : null,
    };
    res.status(statusCode).send(response);
    void next;
};
exports.errorHandler = errorHandler;
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
    }
}
exports.NotFoundError = NotFoundError;
