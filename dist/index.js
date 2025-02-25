"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe_secret = exports.jwt_refresh_expire = exports.jwt_access_expire = exports.jwt_refresh_secret = exports.jwt_access_secret = exports.defPass = exports.saltRound = exports.serverPort = exports.nodeEnv = exports.mongoUrl = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = require("./server");
const errorHandler_1 = require("./middlewares/errorHandler");
const notFound_1 = require("./middlewares/notFound");
const routes_1 = __importDefault(require("./routes/routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
//Initialize dotenv variable access
dotenv_1.default.config();
exports.mongoUrl = process.env.MONGODB_URL;
exports.nodeEnv = process.env.NODE_ENV;
exports.serverPort = process.env.SERVER_PORT;
exports.saltRound = process.env.SALT_ROUND;
exports.defPass = process.env.DEFAULT_PASS;
exports.jwt_access_secret = process.env.JWT_SECRET;
exports.jwt_refresh_secret = process.env.JWT_REFRESH_SECRET;
exports.jwt_access_expire = process.env.JWT_ACCESS_EXPIRES_IN;
exports.jwt_refresh_expire = process.env.JWT_REFRESH_EXPIRES_IN;
exports.stripe_secret = process.env.STRIPE_SECRET;
//Connect Mongodb
(0, server_1.connectToDB)();
//Initialize app
const app = (0, express_1.default)();
//Primary middlewares
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: [
        "https://snoke-stationary-front.vercel.app",
        "http://localhost:5173",
    ],
    credentials: true,
}));
//Applicatin route
app.use("/api", routes_1.default);
app.get("/", (req, res) => {
    res.send("Hello from Snoke stationary shops");
    // Promise.reject();
});
const server = app.listen(exports.serverPort, () => {
    console.log(`Stationary shop is listening on ${exports.serverPort}`);
});
//Global error handler
app.use(errorHandler_1.errorHandler);
app.use("/", notFound_1.notFound);
//Export for vercel configuration
exports.default = app;
//For asynchronous process
process.on("unhandledRejection", () => {
    console.log(`unhandledRejection is detected, shutting down server...`);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
//For synchronous process
process.on("uncaughtException", () => {
    console.log(`uncaughtException is detected, shutting down server...`);
    process.exit(1);
});
