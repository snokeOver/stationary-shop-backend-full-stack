import { Types } from "mongoose";

export interface IOrder {
  email: string;
  product: Types.ObjectId;
  quantity: number;
  totalPrice: number;
  __v?: number;
}
