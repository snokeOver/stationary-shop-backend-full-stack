"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodError = void 0;
const handleZodError = (err) => {
    const status = 422;
    const sources = err.issues.map((issue) => ({
        path: issue === null || issue === void 0 ? void 0 : issue.path[(issue === null || issue === void 0 ? void 0 : issue.path.length) - 1],
        message: issue === null || issue === void 0 ? void 0 : issue.message,
    }));
    return {
        status,
        message: "Validation Error",
        sources,
    };
};
exports.handleZodError = handleZodError;
