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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAProductDB = exports.updateAProductDB = exports.getAProductDB = exports.getAllProductsDB = exports.countTotalProduct = exports.createProductDB = void 0;
const QueryBuilder_1 = require("../../builder/QueryBuilder");
const error_class_1 = require("../../utils/error.class");
const product_constant_1 = require("./product.constant");
const product_model_1 = require("./product.model");
//Create a product data in the MongoDB
const createProductDB = (product) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_model_1.ProductModel.create(product);
    const _a = result.toObject(), { isDeleted, __v } = _a, restResult = __rest(_a, ["isDeleted", "__v"]);
    void isDeleted; // To avoid unused variable warning
    void __v; // To avoid unused variable warning
    return restResult;
});
exports.createProductDB = createProductDB;
//Get totalProduct
const countTotalProduct = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalProduct = yield product_model_1.ProductModel.countDocuments({ isDeleted: false });
    return totalProduct;
});
exports.countTotalProduct = countTotalProduct;
//Get all products from the database
const getAllProductsDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const productQuery = new QueryBuilder_1.QueryBuilder(product_model_1.ProductModel.find(), query)
        .search(product_constant_1.productSearchFields)
        .filter()
        .sort()
        .paginate()
        .selectFields();
    const result = yield productQuery.queryModel;
    // console.log(result);
    return result;
});
exports.getAllProductsDB = getAllProductsDB;
//Get a single product from the database
const getAProductDB = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_model_1.ProductModel.findById(productId)
        .notDeleted()
        .select("-isDeleted -__v");
    if (result.length < 1)
        throw new error_class_1.AppError(404, "Not found", "Resource not found");
    return result;
});
exports.getAProductDB = getAProductDB;
//Update a single product from the database
const updateAProductDB = (productId, updatedContent) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_model_1.ProductModel.findOneAndUpdate({ _id: productId, isDeleted: false }, { $set: updatedContent }, { runValidators: true, new: true }).select("-isDeleted -__v");
    if (!result)
        throw new error_class_1.AppError(404, "Not found", "Resource not found");
    return result;
});
exports.updateAProductDB = updateAProductDB;
//Delete a single product from the database
const deleteAProductDB = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(productId);
    const deleteObj = { isDeleted: true };
    const result = yield product_model_1.ProductModel.findOneAndUpdate({ _id: productId, isDeleted: false }, { $set: deleteObj }, { runValidators: true, new: true }).select("-isDeleted -__v");
    if (!result)
        throw new error_class_1.AppError(404, "Not found", "Resource not found");
    return {};
});
exports.deleteAProductDB = deleteAProductDB;
