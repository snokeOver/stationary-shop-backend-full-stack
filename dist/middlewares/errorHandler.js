"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const __1 = require("..");
const handleZodError_1 = require("./handleZodError");
const handleValidationError_1 = require("./handleValidationError");
const handleStrictMode_1 = require("./handleStrictMode");
const handleCastError_1 = require("./handleCastError");
const handleDuplicateError_1 = require("./handleDuplicateError");
const error_class_1 = require("../utils/error.class");
const errorHandler = (error, req, res, next) => {
    let errorMsg = "Something Went Wrong!";
    let statusCode = error.statusCode || 500;
    let errSources = [
        { path: "", message: "Something Went Wrong!" },
    ];
    // console.log(error);
    //Check for specific error
    if (error instanceof error_class_1.AppError) {
        //Errors we throw by AppError
        statusCode = error.statusCode;
        errorMsg = error.name;
        errSources = [
            {
                path: "",
                message: error.message,
            },
        ];
    }
    else if (error.name === "StrictModeError") {
        //Mongoose strict mode error
        const { status, message, sources } = (0, handleStrictMode_1.handleStrictMode)(error);
        statusCode = status;
        errorMsg = message;
        errSources = sources;
    }
    else if (error.code === 11000) {
        // Mongoose duplicate value for unique field
        const { status, message, sources } = (0, handleDuplicateError_1.handleDuplicateError)(error);
        statusCode = status;
        errorMsg = message;
        errSources = sources;
    }
    else if (error.name === "ZodError") {
        //Zod validation error
        const { status, message, sources } = (0, handleZodError_1.handleZodError)(error);
        statusCode = status;
        errorMsg = message;
        errSources = sources;
    }
    else if (error.name === "ValidationError") {
        //Mongoose validation error
        const { status, message, sources } = (0, handleValidationError_1.handleValidationError)(error);
        statusCode = status;
        errorMsg = message;
        errSources = sources;
    }
    else if (error.name === "CastError") {
        //Mongoose cast error for wrong params
        const { status, message, sources } = (0, handleCastError_1.handleCastError)(error);
        statusCode = status;
        errorMsg = message;
        errSources = sources;
    }
    else if (error instanceof Error) {
        //Errors we throw by AppError
        errorMsg = error.message;
        errSources = [
            {
                path: "",
                message: error.message,
            },
        ];
    }
    else {
        errorMsg = error.message || "Server error";
    }
    const response = Object.assign({ success: false, message: errorMsg, errSources, showError: error }, (__1.nodeEnv === "development" && { stack: error === null || error === void 0 ? void 0 : error.stack }));
    res.status(statusCode).send(response);
    void next;
};
exports.errorHandler = errorHandler;
