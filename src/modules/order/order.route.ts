import express from "express";
import {
  calculateRevenue,
  createAOrder,
  createPaymentIntent,
  getAllOrders,
  getSingleOrder,
} from "./order.controller";
import { validateRequest } from "../../middlewares/validateData";
import { orderValidation } from "./order.validate";
import { auth } from "../../middlewares/auth";
import { confirmOrder } from "./order.service";

const orderRoute = express.Router();

orderRoute.post("/payment-intent", auth("User"), createPaymentIntent);
orderRoute.post(
  "/",
  validateRequest(orderValidation),
  auth("User"),
  createAOrder
);

orderRoute.get("/", auth("User", "Admin"), getAllOrders);
orderRoute.get("/:orderId", auth("User", "Admin"), getSingleOrder);

orderRoute.patch("/:orderId", auth("Admin"), confirmOrder);
orderRoute.get("/revenue", auth("Admin"), calculateRevenue);

export default orderRoute;
