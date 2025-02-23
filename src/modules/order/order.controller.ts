import { NextFunction, Request, Response } from "express";
import {
  calculateRevenueDB,
  createAOrderDB,
  createStripePaymentIntent,
  getAllOrdersFromDB,
  getSingleOrderFromDB,
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

// Control request and response to get all orders
export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getAllOrdersFromDB();

    res.status(200).send({
      message: "All Orders retrieved successfully",
      status: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

//Get single Order
export const getSingleOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await getSingleOrderFromDB(req.params.orderId);
    if (!result) {
      res.status(404).send({
        message: "Order not found",
        status: false,
      });
      return;
    }

    res.status(200).send({
      message: "Order retrieved successfully",
      status: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
