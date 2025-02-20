import { NextFunction, Request, Response } from "express";
import {
  createProductDB,
  deleteAProductDB,
  getAllProductsDB,
  getAProductDB,
  updateAProductDB,
} from "./product.service";

// Control request and response to Create A Product
export const createAProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = req.body;
    const result = await createProductDB(product);

    res.status(200).send({
      message: "Product created successfully",
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Control request and response to Get all Products
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { searchTerm } = req.query;
    const result = await getAllProductsDB(searchTerm as string);

    res.status(200).send({
      message: "Products retrieved successfully",
      status: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Control request and response to Get a single Product by it's ID
export const getAProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const result = await getAProductDB(productId);
    res.status(200).send({
      message: "Product retrieved successfully",
      status: true,
      data: result[0],
    });
  } catch (error) {
    next(error);
  }
};

// Control request and response to update a single Product
export const updateAProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const updatedContent = req.body;

    const result = await updateAProductDB(productId, updatedContent);

    res.status(200).send({
      message: "Product Updated successfully",
      status: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Control request and response to delete a single Product
export const deleteAProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;

    const result = await deleteAProductDB(productId);

    res.status(200).send({
      message: "Product deleted successfully",
      status: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
