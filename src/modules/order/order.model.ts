import mongoose, { model, Schema } from "mongoose";
import { IOrder } from "./order.interface";
import { ProductModel } from "../product/product.model";

const orderSchema = new Schema<IOrder>(
  {
    email: {
      type: String,
      required: [true, "Customer email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) =>
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(value),
        message: "Invalid email format",
      },
    },

    product: {
      type: Schema.Types.ObjectId,
      ref: "products",
      trim: true,
      required: true,
      validate: {
        validator: mongoose.Types.ObjectId.isValid,
        message: "Invalid product ID",
      },
    },

    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
      min: [1, "Quantity should be at least 1"],
    },

    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      validate: {
        validator: (value: number) => value > 0,
        message: "Invalid Total price",
      },
    },
  },

  {
    timestamps: true,
    // strict: "throw", // prevents extra fields and throw error
  }
);

//Pre-hook to validate some aspects before creating a order
orderSchema.pre("save", async function () {
  const existingProduct = await ProductModel.findOne({
    _id: this.product,
    isDeleted: false,
  });

  // Validate product existence
  if (!existingProduct) throw new Error("Product not found in the database");

  const { name, quantity: stockQuantity, inStock } = existingProduct;

  //Validate product availability: When quantity is 0 or inStock is false
  if (stockQuantity === 0 || !inStock)
    throw new Error(`${name} is out of Stock`);

  //Validate order quantity: When the order quantity is greater than the existing quantity
  if (this.quantity > stockQuantity)
    throw new Error(`Insufficient stock for ${name}`);
});

//post-hook to update the quantity of the product
orderSchema.post("save", async function () {
  const existingProduct = await ProductModel.findOne({
    _id: this.product,
    isDeleted: false,
  });

  //When no product found
  if (!existingProduct) throw new Error("Product not found in the DB");

  const updatedFild = {
    quantity: existingProduct.quantity - this.quantity,
    inStock: existingProduct.quantity > this.quantity,
  };

  await ProductModel.findByIdAndUpdate(
    this.product,
    {
      $set: updatedFild,
    },
    {
      new: true,
    }
  );
});

export const OrderModel = model<IOrder>("orders", orderSchema);
