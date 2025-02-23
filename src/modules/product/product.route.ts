import express from "express";
import {
  createAProduct,
  deleteAProduct,
  getAllProducts,
  getAProduct,
  updateAProduct,
} from "./product.controller";
import { validateRequest } from "../../middlewares/validateData";
import { productValidation } from "./product.validation";
import { auth } from "../../middlewares/auth";

const productRouter = express.Router();

productRouter.post(
  "/",
  validateRequest(productValidation),
  auth("Admin"),
  createAProduct
);
productRouter.get("/", getAllProducts);
productRouter.get("/:productId", getAProduct);
productRouter.patch("/:productId", auth("Admin"), updateAProduct);
productRouter.delete("/:productId", auth("Admin"), deleteAProduct);

export default productRouter;
