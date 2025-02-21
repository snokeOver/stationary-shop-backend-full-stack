"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDuplicateError = void 0;
const handleDuplicateError = (err) => {
    const status = 409;
    const sources = [
        {
            path: Object.values(err.keyValue)[0],
            message: `${Object.values(err.keyValue)[0]} is already exist!`,
        },
    ];
    return {
        status,
        message: "Invalid ID",
        sources,
    };
};
exports.handleDuplicateError = handleDuplicateError;
