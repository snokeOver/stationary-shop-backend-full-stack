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
exports.deleteAProduct = exports.updateAProduct = exports.getAProduct = exports.getAllProducts = exports.createAProduct = void 0;
const product_service_1 = require("./product.service");
// Control request and response to Create A Product
const createAProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = req.body;
        const result = yield (0, product_service_1.createProductDB)(product);
        res.status(200).send({
            message: "Product created successfully",
            success: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createAProduct = createAProduct;
// Control request and response to Get all Products
const getAllProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchTerm } = req.query;
        const result = yield (0, product_service_1.getAllProductsDB)(searchTerm);
        res.status(200).send({
            message: "Products retrieved successfully",
            status: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllProducts = getAllProducts;
// Control request and response to Get a single Product by it's ID
const getAProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const result = yield (0, product_service_1.getAProductDB)(productId);
        res.status(200).send({
            message: "Product retrieved successfully",
            status: true,
            data: result[0],
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAProduct = getAProduct;
// Control request and response to update a single Product
const updateAProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const updatedContent = req.body;
        const result = yield (0, product_service_1.updateAProductDB)(productId, updatedContent);
        res.status(200).send({
            message: "Product Updated successfully",
            status: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateAProduct = updateAProduct;
// Control request and response to delete a single Product
const deleteAProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const result = yield (0, product_service_1.deleteAProductDB)(productId);
        res.status(200).send({
            message: "Product deleted successfully",
            status: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteAProduct = deleteAProduct;
