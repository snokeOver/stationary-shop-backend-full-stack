import { model, Schema } from "mongoose";
import { IOrder } from "./order.interface";
import { ProductModel } from "../product/product.model";
import { AppError } from "../../utils/error.class";

const orderSchema = new Schema<IOrder>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    mainOrder: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity should be at least 1"],
        },
        price: {
          type: Number,
          required: true,
          validate: {
            validator: (value: number) => value > 0,
            message: "Invalid price",
          },
        },
      },
    ],

    status: {
      type: String,
      enum: [
        "Drafted",
        "Pending",
        "Shipping",
        "Received",
        "Rejected",
        "Deleted",
      ],
      default: "Drafted",
    },

    totalPrice: {
      type: Number,
      required: true,
      validate: {
        validator: (value: number) => value > 0,
        message: "Invalid Total price",
      },
    },
  },

  {
    timestamps: true,
    strict: "throw", // prevents extra fields and throw error
  }
);

//Pre-hook to validate some aspects before creating a order
orderSchema.pre("save", async function () {
  for (const item of this.mainOrder) {
    const existingProduct = await ProductModel.findOne({
      _id: item.product,
      isDeleted: false,
    });

    // Validate product existence
    if (!existingProduct)
      throw new AppError(404, "Not Found", "Product not found in the database");

    const { name, quantity: stockQuantity, inStock } = existingProduct;

    // Validate product availability
    if (stockQuantity === 0 || !inStock)
      throw new AppError(410, "Stock Out", `${name} is out of stock`);

    // Validate order quantity
    if (item.quantity > stockQuantity)
      throw new AppError(410, "Stock Out", `Insufficient stock for ${name}`);
  }
});

//post-hook to update the quantity of the product
orderSchema.post("save", async function () {
  for (const item of this.mainOrder) {
    const existingProduct = await ProductModel.findOne({
      _id: item.product,
      isDeleted: false,
    });

    // When no product is found
    if (!existingProduct)
      throw new AppError(404, "Not Found", "Product not found in the database");

    const updatedFields = {
      quantity: existingProduct.quantity - item.quantity,
      inStock: existingProduct.quantity > item.quantity,
    };

    await ProductModel.findByIdAndUpdate(
      item.product,
      { $set: updatedFields },
      { new: true }
    );
  }
});

export const OrderModel = model<IOrder>("orders", orderSchema);
