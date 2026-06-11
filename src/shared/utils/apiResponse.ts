import { Response } from "express";

// I use this helper so every successful API response has the same clean structure.
export const sendSuccess = (
  res: Response,
  statusCode: number,
  message: string,
  data?: unknown
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};