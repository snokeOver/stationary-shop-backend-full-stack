"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleStrictMode = void 0;
const handleStrictMode = (err) => {
    const status = 400;
    const sources = [
        {
            path: err === null || err === void 0 ? void 0 : err.path,
            message: err.message,
        },
    ];
    return {
        status,
        message: "Additional field not allowed",
        sources,
    };
};
exports.handleStrictMode = handleStrictMode;
