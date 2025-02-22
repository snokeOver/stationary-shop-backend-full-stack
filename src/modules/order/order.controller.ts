import { NextFunction, Request, Response } from "express";
import {
  calculateRevenueDB,
  createAOrderDB,
  createStripePaymentIntent,
} from "./order.service";

//Controller to create payment intent for a single order
export const createPaymentIntent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await createStripePaymentIntent(req.body.amount);

    res.status(200).send({
      message: "Payment Intent created successfully",
      status: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
//Controller to handle the create a single order
export const createAOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderToCreate = req.body;
    const result = await createAOrderDB(orderToCreate);

    res.status(200).send({
      message: "Order created successfully",
      status: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

//Controller to handle the calculation or total revenue
export const calculateRevenue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await calculateRevenueDB();
    res.status(200).send({
      message: "Revenue calculated successfully",
      status: true,
      data: result[0],
    });
  } catch (error) {
    next(error);
  }
};
