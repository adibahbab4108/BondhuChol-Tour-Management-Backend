/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVar } from "../config/env.config";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const catchAsync =
  (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err: any) => {
       if (envVar.NODE_ENV === "development") {
          console.log(err);
        }
      next(err);
    });
  };
