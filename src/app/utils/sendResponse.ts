import { Response } from "express";

interface TMeta {
  page?: number;
  limit?: number;
  total?: number;
}

interface TResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: TMeta;
}

// Pass: sendResponse(res, { statusCode:201, success:true, message:"xyz", data:user, meta,})
export const sendResponse = <T>(
  res: Response,
  response: TResponse<T>
): Response => {
  const { statusCode, success, message, data, meta } = response;

  return res.status(statusCode).json({
    statusCode,
    success,
    message,
    data,
    meta,
  });
};
