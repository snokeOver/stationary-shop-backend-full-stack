"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order.controller");
const validateData_1 = require("../../middlewares/validateData");
const order_validate_1 = require("./order.validate");
const auth_1 = require("../../middlewares/auth");
const order_service_1 = require("./order.service");
const orderRoute = express_1.default.Router();
orderRoute.post("/payment-intent", (0, auth_1.auth)("User"), order_controller_1.createPaymentIntent);
orderRoute.post("/", (0, validateData_1.validateRequest)(order_validate_1.orderValidation), (0, auth_1.auth)("User"), order_controller_1.createAOrder);
orderRoute.get("/", (0, auth_1.auth)("User", "Admin"), order_controller_1.getAllOrders);
orderRoute.get("/:orderId", (0, auth_1.auth)("User", "Admin"), order_controller_1.getSingleOrder);
orderRoute.patch("/:orderId", (0, auth_1.auth)("Admin"), order_service_1.confirmOrder);
orderRoute.get("/revenue", (0, auth_1.auth)("Admin"), order_controller_1.calculateRevenue);
exports.default = orderRoute;
