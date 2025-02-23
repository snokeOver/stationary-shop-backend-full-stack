//Controller only handle application logic: it takes the request, send the response and call the service function for database operation

// import { userValidation } from "./user.zod";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import {
  blockUserInDB,
  createUserToDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserToDB,
} from "./user.service";

//Create a user data
export const createUser = catchAsync(async (req, res) => {
  const result = await createUserToDB(req.body);
  res.status(200).send({
    success: true,
    message: "User registered successfully!",
    data: result,
  });
});

// Control request and response to block  a single user
export const blockUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.params;
    const result = await blockUserInDB(email);

    res.status(200).send({
      message: `User ${
        result?.status === "InActive" ? "inactivated" : "activated"
      } successfully`,
      status: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Control request and response to update  a single user
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.params;
    const result = await updateUserToDB(email, req.body);
    res.status(200).send({
      message: "User updated successfully",
      status: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Control request and response to get all user
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getAllUsersFromDB();

    res.status(200).send({
      message: "All Users retrieved successfully",
      status: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

//Get sngle user
export const getSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await getSingleUserFromDB(req.params.email);

    if (!result) {
      res.status(404).send({
        message: "User not found",
        status: false,
      });
      return;
    }

    res.status(200).send({
      message: "User retrieved successfully",
      status: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// //Delete a student data
// export const deleteSingleStudent = catchAsync(async (req, res) => {
//   const result = await deleteSingleStudentFromDB(req.params.id);
//   res.status(200).send({
//     success: true,
//     message: "Student deleted successfully!",
//     data: result,
//   });
// });
