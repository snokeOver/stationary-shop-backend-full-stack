import { NextFunction, Request, Response } from "express";
import { stripe_secret } from "../..";
import { AppError } from "../../utils/error.class";
import { IOrder } from "./order.interface";
import { OrderModel } from "./order.model";
import Stripe from "stripe";

//Create a payment Intent for stripe payment
export const createStripePaymentIntent = async (amountToPay: number) => {
  const amount = Math.ceil(amountToPay * 100);
  const stripe = new Stripe(stripe_secret!);

  if (amount <= 0) {
    return {
      message: "Filed to create Payment Intent!",
    };
  }
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    payment_method_types: ["card"],
  });

  return {
    message: "Payment Intent created successfully!",
    clientSecret: paymentIntent.client_secret,
  };
};

//Create a order and save to MongoDB
export const createAOrderDB = async (order: IOrder) => {
  const result = await OrderModel.create(order);
  const { __v, ...restResult } = result.toObject();
  void __v;

  return restResult;
};

//Calculate total revenue from the total orders
export const calculateRevenueDB = async () => {
  const result = await OrderModel.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: "$productDetails",
    },
    {
      $project: {
        totalPrice: { $multiply: ["$quantity", "$productDetails.price"] },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" },
      },
    },
    {
      $project: {
        _id: 0,
        totalRevenue: 1,
      },
    },
  ]);

  return result;
};

//Get all orders from database
export const getAllOrdersFromDB = async () => {
  const Order = await OrderModel.find();

  if (!Order || Order.length === 0) {
    throw new AppError(404, "No Products found", "No products found");
  }

  return Order;
};

// Get a single order from the database by orderId
export const getSingleOrderFromDB = async (orderId: string) => {
  const order = await OrderModel.findOne({ _id: orderId });

  if (!order) {
    throw new AppError(404, "This order not Found", "order does not exist");
  }

  return order;
};

//confirm order
export const confirmOrderByAdmin = async (userId: string) => {
  const confirmOrder = await OrderModel.findByIdAndUpdate(
    userId,
    { $set: { status: "Shipping" } },
    { new: true, runValidators: true }
  );

  if (!confirmOrder) {
    throw new AppError(
      404,
      "order not found",
      "Order not found or order confirmation failed"
    );
  }

  return confirmOrder;
};

// Control request and response to confirm a order by admi
export const confirmOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;
    const result = await confirmOrderByAdmin(orderId);
    res.status(200).send({
      message: "Order Confirmation successfully",
      status: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
