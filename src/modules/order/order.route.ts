import express from "express";
import { calculateRevenue, createAOrder } from "./order.controller";
import { validateRequest } from "../../middlewares/validateData";
import { orderValidation } from "./order.validate";

const orderRoute = express.Router();

orderRoute.post("/", validateRequest(orderValidation), createAOrder);
orderRoute.get("/revenue", calculateRevenue);

export default orderRoute;
