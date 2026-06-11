import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { UserRole } from "@prisma/client";
import { env } from "../config/env";
import { prisma } from "../config/database";

type JwtPayload = {
  id: string;
  email: string;
  role: UserRole;
  accountType: "USER" | "SERVICE_PROVIDER";
};

/**
 * I use this middleware to protect private routes.
 *
 * It checks the Bearer token, verifies the JWT, confirms the account still
 * exists in the database, then attaches the logged-in account to req.user.
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Authentication required. Please provide a valid Bearer token.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;

    if (decoded.accountType === "USER") {
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "Authentication session is no longer valid. Please login again.",
        });
      }
    }

    if (decoded.accountType === "SERVICE_PROVIDER") {
      const provider = await prisma.serviceProvider.findUnique({
        where: { id: decoded.id },
      });

      if (!provider) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "Authentication session is no longer valid. Please login again.",
        });
      }
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      accountType: decoded.accountType,
    };

    next();
  } catch {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
};