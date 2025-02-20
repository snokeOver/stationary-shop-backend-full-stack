import express from "express";
import {
  createAProduct,
  deleteAProduct,
  getAllProducts,
  getAProduct,
  updateAProduct,
} from "./product.controller";

const productRouter = express.Router();

productRouter.post("/", createAProduct);
productRouter.get("/", getAllProducts);
productRouter.get("/:productId", getAProduct);
productRouter.put("/:productId", updateAProduct);
productRouter.delete("/:productId", deleteAProduct);

export default productRouter;
