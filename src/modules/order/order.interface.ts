import { Types } from "mongoose";

export type TOrderStatuse =
  | "Drafted"
  | "Pending"
  | "Shipping"
  | "Received"
  | "Rejected"
  | "Deleted";

export interface IOrder {
  userInfo: {
    address: string;
    email: string;
    name: string;
    phone: string;
  };
  orderItems: {
    availableQuantity: number;
    imageUrl: string;
    name: string;
    _id: Types.ObjectId;
    price: number;
    purchaseQuantity: number;
  }[];

  status: TOrderStatuse;
  paidAmount: number;
  txId: string;
  __v?: number;
}
