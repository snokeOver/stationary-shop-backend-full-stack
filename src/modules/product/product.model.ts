import {
  HydratedDocument,
  Model,
  QueryWithHelpers,
  Schema,
  model,
} from "mongoose";

import {
  IProduct,
  IProductNotDeletedQH,
  TProductModel,
} from "./product.interface";

import { UpdateQuery } from "mongoose";
import { AppError } from "../../utils/error.class";

const productSchema = new Schema<
  IProduct,
  Model<IProduct, IProductNotDeletedQH>,
  Record<string, never>,
  IProductNotDeletedQH
>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      unique: true,
    },

    brand: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: [0, "Price must be a positive number"],
    },

    category: {
      type: String,
      enum: {
        values: [
          "Writing",
          "Office Supplies",
          "Art Supplies",
          "Educational",
          "Technology",
        ],
        message: "{VALUE} is not a valid category",
      },
      required: [true, "Category is required"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity must be a positive number"],
    },

    inStock: {
      type: Boolean,
      required: [true, "In-stock status is required"],
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },

  // Adds `createdAt` and `updatedAt` fields automatically
  {
    timestamps: true,
    strict: "throw", // prevents extra fields and throw error
  }
);

//Custom querry to get only the non-deleted product
productSchema.query.notDeleted = function byName(
  this: QueryWithHelpers<
    HydratedDocument<IProduct>,
    HydratedDocument<IProduct>,
    IProductNotDeletedQH
  >
) {
  return this.find({ isDeleted: false });
};

//Pre middleware to find invalid fields/keys before update
productSchema.pre("findOneAndUpdate", function (next) {
  const givenUpdateFields = (this.getUpdate() as UpdateQuery<IProduct>).$set;

  if (typeof givenUpdateFields !== "object" || givenUpdateFields === null) {
    return next(new AppError(400, "Invalid", "Invalid Update structure !"));
  }

  if (Object.keys(givenUpdateFields).length === 1)
    return next(new AppError(400, "Invalid", "Nothing to update !"));

  const schemaKeys = Object.keys(productSchema.paths);

  const invalidFields = Object.keys(givenUpdateFields).filter(
    (key: string) => !schemaKeys.includes(key)
  );

  if (invalidFields.length > 0)
    return next(
      new AppError(
        400,
        "Invalid",
        `Invalid Fields: ${invalidFields.join(", ")}`
      )
    );

  next();
});

export const ProductModel = model<IProduct, TProductModel>(
  "products",
  productSchema
);
