"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCastError = void 0;
const handleCastError = (err) => {
    const status = 400;
    const sources = [
        {
            path: err === null || err === void 0 ? void 0 : err.path,
            message: err.message,
        },
    ];
    return {
        status,
        message: "Invalid ID",
        sources,
    };
};
exports.handleCastError = handleCastError;
