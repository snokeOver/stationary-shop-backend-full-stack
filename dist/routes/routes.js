"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_route_1 = __importDefault(require("../modules/product/product.route"));
const order_route_1 = __importDefault(require("../modules/order/order.route"));
const router = (0, express_1.Router)();
const routes = [
    // {
    //   path: "/users",
    //   route: userRoute,
    // },
    {
        path: "/products",
        route: product_route_1.default,
    },
    {
        path: "/orders",
        route: order_route_1.default,
    },
    // {
    //   path: "/admins",
    //   route: adminRoute,
    // },
    // {
    //   path: "/auth",
    //   route: authRoute,
    // },
];
routes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
