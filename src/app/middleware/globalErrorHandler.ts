import { NextFunction, Request, Response } from "express";
import { envVar } from "../config/env.config";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  next: NextFunction
) => {

  const message = err.message || "Internal Server Error";
  const statusCode = 500;

  // if (err instanceof AppError) {
  //   statusCode = err.statusCode;
  //   message = err.message;
  // }

  res.status(err.status || statusCode).json({
    success: false,
    message,
    err,
    stack: envVar.NODE_ENV === "development" ? err.stack : null,
  });
};
