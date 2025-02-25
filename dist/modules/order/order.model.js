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
exports.OrderModel = void 0;
const mongoose_1 = require("mongoose");
const product_model_1 = require("../product/product.model");
const error_class_1 = require("../../utils/error.class");
const orderSchema = new mongoose_1.Schema({
    userInfo: {
        address: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
    },
    orderItems: [
        {
            availableQuantity: {
                type: Number,
                required: true,
                min: [0, "Available quantity must be non-negative"],
            },
            imageUrl: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                required: true,
                trim: true,
            },
            _id: {
                type: mongoose_1.Schema.Types.ObjectId,
                required: true,
                ref: "products",
            },
            price: {
                type: Number,
                required: true,
                validate: {
                    validator: (value) => value > 0,
                    message: "Price must be a positive number",
                },
            },
            purchaseQuantity: {
                type: Number,
                required: true,
                min: [1, "Purchase quantity must be at least 1"],
            },
        },
    ],
    status: {
        type: String,
        enum: [
            "Drafted",
            "Pending",
            "Shipping",
            "Received",
            "Rejected",
            "Deleted",
        ],
        default: "Drafted",
    },
    paidAmount: {
        type: Number,
        required: true,
        validate: {
            validator: (value) => value > 0,
            message: "Paid amount must be a positive number",
        },
    },
    txId: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
    strict: "throw", // prevents extra fields and throws an error if found
});
// Pre-hook to validate product availability before saving an order
orderSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        // Iterate over the orderItems array
        for (const item of this.orderItems) {
            const existingProduct = yield product_model_1.ProductModel.findOne({
                _id: item._id, // item._id represents the product id in our new schema
                isDeleted: false,
            });
            // Validate product existence
            if (!existingProduct) {
                throw new error_class_1.AppError(404, "Not Found", "Product not found in the database");
            }
            const { name, quantity: stockQuantity, inStock } = existingProduct;
            // Validate product availability
            if (stockQuantity === 0 || !inStock) {
                throw new error_class_1.AppError(410, "Stock Out", `${name} is out of stock`);
            }
            // Validate order quantity against available stock
            if (item.purchaseQuantity > stockQuantity) {
                throw new error_class_1.AppError(410, "Stock Out", `Insufficient stock for ${name}`);
            }
        }
    });
});
// Post-hook to update product stock after an order is saved
orderSchema.post("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        for (const item of this.orderItems) {
            const existingProduct = yield product_model_1.ProductModel.findOne({
                _id: item._id,
                isDeleted: false,
            });
            // When no product is found (should rarely happen)
            if (!existingProduct) {
                throw new error_class_1.AppError(404, "Not Found", "Product not found in the database");
            }
            // Update the stock: subtract the ordered purchaseQuantity
            const newQuantity = existingProduct.quantity - item.purchaseQuantity;
            const updatedFields = {
                quantity: newQuantity,
                inStock: newQuantity > 0,
            };
            yield product_model_1.ProductModel.findByIdAndUpdate(item._id, { $set: updatedFields }, { new: true });
        }
    });
});
exports.OrderModel = (0, mongoose_1.model)("orders", orderSchema);
