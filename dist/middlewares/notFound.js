"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const notFound = (req, res, next) => {
    const response = {
        message: "API not found",
        success: false,
        error: "",
    };
    res.status(404).send(response);
    void next;
};
exports.notFound = notFound;
