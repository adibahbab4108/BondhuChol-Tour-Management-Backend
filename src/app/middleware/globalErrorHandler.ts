/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVar } from "../config/env.config";
import mongoose from "mongoose";
import { deleteImageFromCloudinary } from "../config/cloudinary.config";

const handleDuplicateError = (err: any) => {
  const match = err.message.match(/"([^"]+)"/);

  return {
    statusCode: 400,
    message: match ? `${match[1]} already exist` : err.message,
  };
};

const handleCastError = (err: mongoose.Error.CastError) => {
  return {
    statusCode: 400,
    message: "Invalid MongoDB ObjectId. Please provide a valid ID",
  };
};

const handleValidationError = (err: mongoose.Error.ValidationError) => {
  const errorSources: { path: string; message: string }[] = [];
  const errors = Object.values(err.errors);

  errors.forEach((errObj: any) =>
    errorSources.push({
      path: errObj.path,
      message: errObj.message,
    })
  );

  return {
    statusCode: 400,
    message: "Validation Error",
    errorSources,
  };
};

const handleZodError = (err: any) => {
  const errorSources: { path: any; message: any }[] = [];
  err.issues.forEach((issue: any) => {
    errorSources.push({
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    });
  });
  return {
    statusCode: 400,
    message: "Zod error",
    errorSources,
  };
};
export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (envVar.NODE_ENV === "development") {
    console.log(err);
  }
  if (req.file) {
    await deleteImageFromCloudinary(req.file.path);
  }
  if (Array.isArray(req.files) && req.files.length > 0) {
    const imageUrls = req.files as Express.Multer.File[];
    await Promise.all(imageUrls.map(url => deleteImageFromCloudinary(url.path)));
  }
  
  let message = err.message || "Internal Server Error";
  let statusCode = 500;
  let errorSources: any = [];

  if (err.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  } else if (err.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  } else if (err.name === "ZodError") {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);

    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  }

  // if (err instanceof AppError) {
  //   statusCode = err.statusCode;
  //   message = err.message;
  // }

  res.status(err.status || statusCode).json({
    success: false,
    message,
    errorSources,
    err: envVar.NODE_ENV === "development" ? err : null,
    stack: envVar.NODE_ENV === "development" ? err.stack : null,
  });
};
