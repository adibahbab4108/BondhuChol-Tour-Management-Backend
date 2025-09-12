import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVar } from "../config/env.config";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { isActive } from "../modules/user/user.interface";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization || req.cookies.accessToken;
      if (!accessToken) {
        throw new AppError("No token received", 401);
      }

      const decodedToken = verifyToken(accessToken, envVar.JWT_ACCESS_SECRET);

      if (!decodedToken) {
        throw new AppError("Invalid token", 401);
      }

      const isUserExist = await User.findOne({
        email: decodedToken.email,
      });

      if (!isUserExist) {
        throw new AppError("User does not exist", 404);
      }
      if (
        isUserExist.isActive === isActive.BLOCKED ||
        isUserExist.isActive === isActive.INACTIVE
      ) {
        throw new AppError(`User is ${isUserExist.isActive}`, 404);
      }
      if(!isUserExist.isVerified){
        throw new AppError("User is not verified", 404);
      }
      if (isUserExist.isDeleted) {
        throw new AppError("User is deleted", 404);
      }

      //authRoles = ["ADMIN", "SUPER_ADMIN"].includes("ADMIN")
      if (!authRoles.includes((decodedToken as JwtPayload).role)) {
        throw new AppError("You are not authorized to access this route", 403);
      }

      req.user = decodedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
