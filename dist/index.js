"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.node_env = exports.mongoDB_Url = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const server_1 = require("./server");
const product_route_1 = __importDefault(require("./modules/product/product.route"));
const order_route_1 = __importDefault(require("./modules/order/order.route"));
const errorHandler_1 = require("./errorHandler");
//Initialize dotenv variables access
dotenv_1.default.config();
const server_port = process.env.SERVER_PORT;
exports.mongoDB_Url = process.env.MONGODB_URL;
exports.node_env = process.env.NODE_ENV;
//Connect MongoDB via Mongoose
(0, server_1.connectToDB)();
//Initialize app
const app = (0, express_1.default)();
//Primary middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Application routes
app.use("/api/products", product_route_1.default);
app.use("/api/orders", order_route_1.default);
app.get("/", (req, res) => {
    res.status(200).send("Hello from stationary shop");
});
app.listen(server_port, () => [
    console.log(`Stationary shop is listening on port ${server_port}`),
]);
//Global error handler
app.use(errorHandler_1.errorHandler);
//Export app for vercel
exports.default = app;
