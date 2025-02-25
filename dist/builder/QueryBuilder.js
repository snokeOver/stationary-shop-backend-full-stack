"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
class QueryBuilder {
    constructor(queryModel, query) {
        this.queryModel = queryModel;
        this.query = query;
    }
    search(searchFields) {
        var _a;
        const searchTerm = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.searchTerm;
        const searchQuery = searchTerm
            ? {
                $or: searchFields.map((field) => ({
                    [field]: { $regex: searchTerm, $options: "i" },
                })),
            }
            : {};
        this.queryModel = this.queryModel.find(searchQuery);
        return this;
    }
    filter() {
        const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
        const copiedQuery = Object.assign({}, this.query);
        excludeFields.forEach((el) => delete copiedQuery[el]);
        // Handle minPrice and maxPrice
        if (copiedQuery.minPrice || copiedQuery.maxPrice) {
            // Build the price filter object
            const priceFilter = {};
            if (copiedQuery.minPrice) {
                priceFilter.$gte = Number(copiedQuery.minPrice);
            }
            if (copiedQuery.maxPrice) {
                priceFilter.$lte = Number(copiedQuery.maxPrice);
            }
            // Add price filter to the query
            copiedQuery.price = priceFilter;
            // Remove minPrice and maxPrice from the copied query
            delete copiedQuery.minPrice;
            delete copiedQuery.maxPrice;
        }
        this.queryModel = this.queryModel.find(copiedQuery);
        return this;
    }
    sort() {
        var _a;
        const sortQuery = ((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.sort) || "-createdAt"; //Default sort based on createdAt
        this.queryModel = this.queryModel.sort(sortQuery);
        return this;
    }
    paginate() {
        var _a, _b;
        const limitQuery = Number((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.limit) || 6;
        const pageQuery = Number((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.page) || 1;
        const skipQuery = (pageQuery - 1) * limitQuery;
        this.queryModel = this.queryModel.skip(skipQuery).limit(limitQuery);
        return this;
    }
    selectFields() {
        var _a, _b;
        const fieldsQuery = ((_b = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.fields) === null || _b === void 0 ? void 0 : _b.split(",").join(" ")) || "-__v";
        this.queryModel = this.queryModel.select(fieldsQuery);
        return this;
    }
}
exports.QueryBuilder = QueryBuilder;
