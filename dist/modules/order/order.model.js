"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = __importStar(require("mongoose"));
const product_model_1 = require("../product/product.model");
const orderSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, "Customer email is required"],
        trim: true,
        lowercase: true,
        validate: {
            validator: (value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(value),
            message: "Invalid email format",
        },
    },
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "products",
        trim: true,
        required: true,
        validate: {
            validator: mongoose_1.default.Types.ObjectId.isValid,
            message: "Invalid product ID",
        },
    },
    quantity: {
        type: Number,
        required: [true, "Product quantity is required"],
        min: [1, "Quantity should be at least 1"],
    },
    totalPrice: {
        type: Number,
        required: [true, "Total price is required"],
        validate: {
            validator: (value) => value > 0,
            message: "Invalid Total price",
        },
    },
}, {
    timestamps: true,
    // strict: "throw", // prevents extra fields and throw error
});
//Pre-hook to validate some aspects before creating a order
orderSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        const existingProduct = yield product_model_1.ProductModel.findOne({
            _id: this.product,
            isDeleted: false,
        });
        // Validate product existence
        if (!existingProduct)
            throw new Error("Product not found in the database");
        const { name, quantity: stockQuantity, inStock } = existingProduct;
        //Validate product availability: When quantity is 0 or inStock is false
        if (stockQuantity === 0 || !inStock)
            throw new Error(`${name} is out of Stock`);
        //Validate order quantity: When the order quantity is greater than the existing quantity
        if (this.quantity > stockQuantity)
            throw new Error(`Insufficient stock for ${name}`);
    });
});
//post-hook to update the quantity of the product
orderSchema.post("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        const existingProduct = yield product_model_1.ProductModel.findOne({
            _id: this.product,
            isDeleted: false,
        });
        //When no product found
        if (!existingProduct)
            throw new Error("Product not found in the DB");
        const updatedFild = {
            quantity: existingProduct.quantity - this.quantity,
            inStock: existingProduct.quantity > this.quantity,
        };
        yield product_model_1.ProductModel.findByIdAndUpdate(this.product, {
            $set: updatedFild,
        }, {
            new: true,
        });
    });
});
exports.OrderModel = (0, mongoose_1.model)("orders", orderSchema);
