import { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/errors/AppError";

// I use one global error handler instead of repeating try/catch response logic everywhere.
export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("API Error:", error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
  });
};