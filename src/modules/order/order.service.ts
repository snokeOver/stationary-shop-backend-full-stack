import { IOrder } from "./order.interface";
import { OrderModel } from "./order.model";

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
