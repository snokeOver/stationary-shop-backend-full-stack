"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("./product.controller");
const validateData_1 = require("../../middlewares/validateData");
const product_validation_1 = require("./product.validation");
const auth_1 = require("../../middlewares/auth");
const productRouter = express_1.default.Router();
productRouter.post("/", (0, validateData_1.validateRequest)(product_validation_1.productValidation), (0, auth_1.auth)("Admin"), product_controller_1.createAProduct);
productRouter.get("/", product_controller_1.getAllProducts);
productRouter.get("/:productId", product_controller_1.getAProduct);
productRouter.patch("/:productId", (0, auth_1.auth)("Admin"), product_controller_1.updateAProduct);
productRouter.delete("/:productId", (0, auth_1.auth)("Admin"), product_controller_1.deleteAProduct);
exports.default = productRouter;
