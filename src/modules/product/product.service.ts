import { QueryBuilder } from "../../builder/QueryBuilder";
import { AppError } from "../../utils/error.class";
import { productSearchFields } from "./product.constant";
import { IProduct } from "./product.interface";
import { ProductModel } from "./product.model";

//Create a product data in the MongoDB
export const createProductDB = async (product: IProduct) => {
  const result = await ProductModel.create(product);
  const { isDeleted, __v, ...restResult } = result.toObject();
  void isDeleted; // To avoid unused variable warning
  void __v; // To avoid unused variable warning
  return restResult;
};

//Get totalProduct
export const countTotalProduct = async () => {
  const totalProduct = await ProductModel.countDocuments({ isDeleted: false });
  return totalProduct;
};

//Get all products from the database
export const getAllProductsDB = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(ProductModel.find(), query)
    .search(productSearchFields)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const result = await productQuery.queryModel;
  // console.log(result);
  return result;
};

//Get a single product from the database
export const getAProductDB = async (productId: string) => {
  const result = await ProductModel.findById(productId)
    .notDeleted()
    .select("-isDeleted -__v");

  if (result.length < 1)
    throw new AppError(404, "Not found", "Resource not found");

  return result;
};

//Update a single product from the database
export const updateAProductDB = async (
  productId: string,
  updatedContent: Partial<IProduct>
) => {
  const result = await ProductModel.findOneAndUpdate(
    { _id: productId, isDeleted: false },
    { $set: updatedContent },
    { runValidators: true, new: true }
  ).select("-isDeleted -__v");

  if (!result) throw new AppError(404, "Not found", "Resource not found");

  return result;
};

//Delete a single product from the database
export const deleteAProductDB = async (productId: string) => {
  // console.log(productId);
  const deleteObj = { isDeleted: true };
  const result = await ProductModel.findOneAndUpdate(
    { _id: productId, isDeleted: false },
    { $set: deleteObj },
    { runValidators: true, new: true }
  ).select("-isDeleted -__v");

  if (!result) throw new AppError(404, "Not found", "Resource not found");

  return {};
};
