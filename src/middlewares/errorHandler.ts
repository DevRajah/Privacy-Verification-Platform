import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../shared/errors/AppError";

// I use one global error handler instead of repeating try/catch response logic everywhere.
export const errorHandler = (
  error: unknown,
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

  // I catch known Prisma errors so database details do not leak to API users.
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2003") {
      return res.status(400).json({
        success: false,
        message:
          "The requested operation references a record that no longer exists.",
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Requested resource was not found.",
      });
    }
  }

  return res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
  });
};