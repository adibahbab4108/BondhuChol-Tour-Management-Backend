/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

// const createUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<any> => {
//   try {
//     const user = await userService.createUser(req.body);
//     res.status(201).json({
//       message: "User created successfully",
//       user,
//     });
//   } catch (error: any) {
//     console.log(error);
//     next(error);
//   }
// };

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const user = await userService.createUser(req.body);

   sendResponse(res,{
      statusCode: 201,
      success: true,
      message: "User created successfully",
      data: user,
   })
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const result = await userService.getAllUsers();
    // res.status(200).json({
    //   message: "Users retrieved successfully",
    //   data:users,
    // });
    sendResponse(res,{
      statusCode: 200,
      success: true,
      message: "Users retrieved successfully",
      data: result.data,
      meta:result.meta,
   })
  }
);

export const userController = {
  createUser,
  getAllUsers,
};
