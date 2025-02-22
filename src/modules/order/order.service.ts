import { stripe_secret } from "../..";
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
