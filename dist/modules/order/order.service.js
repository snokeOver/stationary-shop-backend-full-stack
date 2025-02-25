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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmOrder = exports.confirmOrderByAdmin = exports.getSingleOrderFromDB = exports.getAllOrdersFromDB = exports.calculateRevenueDB = exports.createAOrderDB = exports.createStripePaymentIntent = void 0;
const __1 = require("../..");
const error_class_1 = require("../../utils/error.class");
const order_model_1 = require("./order.model");
const stripe_1 = __importDefault(require("stripe"));
//Create a payment Intent for stripe payment
const createStripePaymentIntent = (amountToPay) => __awaiter(void 0, void 0, void 0, function* () {
    const amount = Math.ceil(amountToPay * 100);
    const stripe = new stripe_1.default(__1.stripe_secret);
    if (amount <= 0) {
        return {
            message: "Filed to create Payment Intent!",
        };
    }
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = yield stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
    });
    return {
        message: "Payment Intent created successfully!",
        clientSecret: paymentIntent.client_secret,
    };
});
exports.createStripePaymentIntent = createStripePaymentIntent;
//Create a order and save to MongoDB
const createAOrderDB = (order) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.OrderModel.create(order);
    const _a = result.toObject(), { __v } = _a, restResult = __rest(_a, ["__v"]);
    void __v;
    return restResult;
});
exports.createAOrderDB = createAOrderDB;
//Calculate total revenue from the total orders
const calculateRevenueDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.OrderModel.aggregate([
        {
            $lookup: {
                from: "products",
                localField: "product",
                foreignField: "_id",
                as: "productDetails",
            },
        },
        {
            $unwind: "$productDetails",
        },
        {
            $project: {
                totalPrice: { $multiply: ["$quantity", "$productDetails.price"] },
            },
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalPrice" },
            },
        },
        {
            $project: {
                _id: 0,
                totalRevenue: 1,
            },
        },
    ]);
    return result;
});
exports.calculateRevenueDB = calculateRevenueDB;
//Get all orders from database
const getAllOrdersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const Order = yield order_model_1.OrderModel.find();
    if (!Order || Order.length === 0) {
        throw new error_class_1.AppError(404, "No Products found", "No products found");
    }
    return Order;
});
exports.getAllOrdersFromDB = getAllOrdersFromDB;
// Get a single order from the database by orderId
const getSingleOrderFromDB = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.OrderModel.findOne({ _id: orderId });
    if (!order) {
        throw new error_class_1.AppError(404, "This order not Found", "order does not exist");
    }
    return order;
});
exports.getSingleOrderFromDB = getSingleOrderFromDB;
//confirm order
const confirmOrderByAdmin = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const confirmOrder = yield order_model_1.OrderModel.findByIdAndUpdate(userId, { $set: { status: "Shipping" } }, { new: true, runValidators: true });
    if (!confirmOrder) {
        throw new error_class_1.AppError(404, "order not found", "Order not found or order confirmation failed");
    }
    return confirmOrder;
});
exports.confirmOrderByAdmin = confirmOrderByAdmin;
// Control request and response to confirm a order by admi
const confirmOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const result = yield (0, exports.confirmOrderByAdmin)(orderId);
        res.status(200).send({
            message: "Order Confirmation successfully",
            status: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.confirmOrder = confirmOrder;
