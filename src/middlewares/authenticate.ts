import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { UserRole } from "@prisma/client";
import { env } from "../config/env";

type JwtPayload = {
  id: string;
  email: string;
  role: UserRole;
  accountType: "USER" | "SERVICE_PROVIDER";
};

/**
 * I use this middleware to protect private routes.
 *
 * What it does:
 * 1. Checks if the request has an Authorization header
 * 2. Extracts the Bearer token
 * 3. Verifies the JWT
 * 4. Saves the logged-in account details inside req.user
 *
 * This supports the dissertation's access control design because
 * protected services should only be used by authenticated users/providers.
 */
export const authenticate = (
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