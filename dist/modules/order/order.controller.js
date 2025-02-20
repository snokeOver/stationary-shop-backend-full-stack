"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRevenue = exports.createAOrder = void 0;
const order_service_1 = require("./order.service");
//Controller to handle the create a single order
const createAOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderToCreate = req.body;
        const result = yield (0, order_service_1.createAOrderDB)(orderToCreate);
        res.status(200).send({
            message: "Order created successfully",
            status: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createAOrder = createAOrder;
//Controller to handle the calculation or total revenue
const calculateRevenue = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, order_service_1.calculateRevenueDB)();
        res.status(200).send({
            message: "Revenue calculated successfully",
            status: true,
            data: result[0],
        });
    }
    catch (error) {
        next(error);
    }
});
exports.calculateRevenue = calculateRevenue;
