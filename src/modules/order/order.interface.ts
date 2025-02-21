import { Types } from "mongoose";

export type TOrderStatuse =
  | "Drafted"
  | "Pending"
  | "Shipping"
  | "Received"
  | "Rejected"
  | "Deleted";

export interface IOrder {
  email: string;
  mainOrder: {
    product: Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  status: TOrderStatuse;
  totalPrice: number;
  __v?: number;
}
