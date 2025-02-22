import { model, Schema } from "mongoose";
import { IOrder } from "./order.interface";
import { ProductModel } from "../product/product.model";
import { AppError } from "../../utils/error.class";

const orderSchema = new Schema<IOrder>(
  {
    userInfo: {
      address: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
    },

    orderItems: [
      {
        availableQuantity: {
          type: Number,
          required: true,
          min: [0, "Available quantity must be non-negative"],
        },
        imageUrl: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
          trim: true,
        },
        _id: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "products",
        },
        price: {
          type: Number,
          required: true,
          validate: {
            validator: (value: number) => value > 0,
            message: "Price must be a positive number",
          },
        },
        purchaseQuantity: {
          type: Number,
          required: true,
          min: [1, "Purchase quantity must be at least 1"],
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

    paidAmount: {
      type: Number,
      required: true,
      validate: {
        validator: (value: number) => value > 0,
        message: "Paid amount must be a positive number",
      },
    },

    txId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    strict: "throw", // prevents extra fields and throws an error if found
  }
);

// Pre-hook to validate product availability before saving an order
orderSchema.pre("save", async function () {
  // Iterate over the orderItems array
  for (const item of this.orderItems) {
    const existingProduct = await ProductModel.findOne({
      _id: item._id, // item._id represents the product id in our new schema
      isDeleted: false,
    });

    // Validate product existence
    if (!existingProduct) {
      throw new AppError(404, "Not Found", "Product not found in the database");
    }

    const { name, quantity: stockQuantity, inStock } = existingProduct;

    // Validate product availability
    if (stockQuantity === 0 || !inStock) {
      throw new AppError(410, "Stock Out", `${name} is out of stock`);
    }

    // Validate order quantity against available stock
    if (item.purchaseQuantity > stockQuantity) {
      throw new AppError(410, "Stock Out", `Insufficient stock for ${name}`);
    }
  }
});

// Post-hook to update product stock after an order is saved
orderSchema.post("save", async function () {
  for (const item of this.orderItems) {
    const existingProduct = await ProductModel.findOne({
      _id: item._id,
      isDeleted: false,
    });

    // When no product is found (should rarely happen)
    if (!existingProduct) {
      throw new AppError(404, "Not Found", "Product not found in the database");
    }

    // Update the stock: subtract the ordered purchaseQuantity
    const newQuantity = existingProduct.quantity - item.purchaseQuantity;

    const updatedFields = {
      quantity: newQuantity,
      inStock: newQuantity > 0,
    };

    await ProductModel.findByIdAndUpdate(
      item._id,
      { $set: updatedFields },
      { new: true }
    );
  }
});

export const OrderModel = model<IOrder>("orders", orderSchema);
