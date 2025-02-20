import { HydratedDocument, Model, QueryWithHelpers } from "mongoose";

export type TCategory =
  | "Writing"
  | "Office Supplies"
  | "Art Supplies"
  | "Educational"
  | "Technology";

export interface IProduct {
  name: string;
  brand: string;
  price: number;
  category: TCategory;
  description: string;
  quantity: number;
  inStock: boolean;
  isDeleted: boolean;
  __v?: number;
}

export interface IProductNotDeletedQH {
  notDeleted(): QueryWithHelpers<
    HydratedDocument<IProduct>[],
    HydratedDocument<IProduct>,
    IProductNotDeletedQH
  >;
}

export type TProductModel = Model<IProduct, IProductNotDeletedQH>;
