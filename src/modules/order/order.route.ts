import express from "express";
import { calculateRevenue, createAOrder } from "./order.controller";

const orderRoute = express.Router();

orderRoute.post("/", createAOrder);
orderRoute.get("/revenue", calculateRevenue);

export default orderRoute;
