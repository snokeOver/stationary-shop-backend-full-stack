//Controller only handle application logic: it takes the request, send the response and call the service function for database operation

// import { userValidation } from "./user.zod";
import { catchAsync } from "../../utils/catchAsync";
import { createUserToDB } from "./user.service";

//Create a student data
export const createUser = catchAsync(async (req, res) => {
  const result = await createUserToDB(req.body);
  res.status(200).send({
    success: true,
    message: "User registered successfully!",
    data: result,
  });
});

// //Delete a student data
// export const deleteSingleStudent = catchAsync(async (req, res) => {
//   const result = await deleteSingleStudentFromDB(req.params.id);
//   res.status(200).send({
//     success: true,
//     message: "Student deleted successfully!",
//     data: result,
//   });
// });
