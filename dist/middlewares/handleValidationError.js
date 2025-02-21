"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationError = void 0;
const handleValidationError = (err) => {
    const status = 422;
    const sources = Object.values(err.errors).map((val) => ({
        path: val === null || val === void 0 ? void 0 : val.path,
        message: val === null || val === void 0 ? void 0 : val.message,
    }));
    return {
        status,
        message: "Validation Error",
        sources,
    };
};
exports.handleValidationError = handleValidationError;
