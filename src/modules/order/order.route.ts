import express from "express";
import {
  calculateRevenue,
  createAOrder,
  createPaymentIntent,
} from "./order.controller";
import { validateRequest } from "../../middlewares/validateData";
import { orderValidation } from "./order.validate";
import { auth } from "../../middlewares/auth";

const orderRoute = express.Router();

orderRoute.post("/payment-intent", auth("User"), createPaymentIntent);
orderRoute.post("/", validateRequest(orderValidation), createAOrder);
orderRoute.get("/revenue", calculateRevenue);

export default orderRoute;
